import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import withFieldValidation from './withFieldValidation';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => Component => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = { ...Component.defaultProps, t: () => 'some translated stuff' };
    return Component;
  },
}));

const simulateChangeField = (element, value) => {
  const event = { target: { name: element.props().name, value } };
  element.simulate('change', event);
};

// eslint-disable-next-line
const Field = ({ valid, FormHelperTextProps, helperText, error, ...props }) => <input type="text" {...props} />;

const mockContext = {
  registerValidatedField: () => {},
  deregisterValidatedField: () => {},
  isFormSubmitted: () => {},
  updateFieldValidationState: () => {},
};

const FieldwithValidation = withFieldValidation(Field);

describe('withFieldValidation', () => {
  it('Should call onChange prop when the field is changed', () => {
    const onChangeMock = jest.fn();
    const wrapper = shallow(
      <FieldwithValidation
        name="field1"
        id="field"
        value="a value"
        validators={[{ rule: 'required' }]}
        onChange={onChangeMock}
      />,
      { context: mockContext },
    );

    const fieldDomElement = wrapper.find('#field').last();
    simulateChangeField(fieldDomElement, '0');
    expect(onChangeMock).toHaveBeenCalled();
  });

  it('Should register as invalid if it has errors', () => {
    const registerValidatedFieldMock = jest.fn();
    mockContext.registerValidatedField = registerValidatedFieldMock;
    const wrapper = shallow(
      <FieldwithValidation name="field1" id="field" value="a cool value" onChange={() => {}} />,
      { context: mockContext, disableLifecycleMethods: true },
    );
    const instance = wrapper.instance();
    instance.getErrors = jest.fn(() => 'some error');
    instance.componentDidMount();
    expect(registerValidatedFieldMock).toHaveBeenCalledWith('field1', false);
  });

  it('Should register as valid if it has errors', () => {
    const registerValidatedFieldMock = jest.fn();
    mockContext.registerValidatedField = registerValidatedFieldMock;
    const wrapper = shallow(
      <FieldwithValidation name="field1" id="field" value="a cool value" onChange={() => {}} />,
      { context: mockContext, disableLifecycleMethods: true },
    );
    const instance = wrapper.instance();
    instance.getErrors = jest.fn(() => undefined);
    instance.componentDidMount();
    expect(registerValidatedFieldMock).toHaveBeenCalledWith('field1', true);
  });

  it("Should not call context's updateFieldValidationState() if the errors don't change", () => {
    // This also applies for valid values, as the errors wouldn't change (they keep being undefined)
    mockContext.updateFieldValidationState = jest.fn();
    const wrapper = shallow(
      <FieldwithValidation name="field1" value={'value1'} validators={[{ rule: 'required' }]} />,
      { context: mockContext },
    );
    const instance = wrapper.instance();
    instance.getErrors = jest.fn(() => 'error2');
    wrapper.setProps({
      value: 'a new value',
    });
    expect(mockContext.updateFieldValidationState).not.toHaveBeenCalled();
  });

  it("Should call context's updateFieldValidationState() if the errors change", () => {
    // This also applies for valid values, as the errors wouldn't change (they keep being undefined)
    mockContext.updateFieldValidationState = jest.fn();
    const wrapper = shallow(
      <FieldwithValidation name="field1" value={'value1'} validators={[{ rule: 'required' }]} />,
      { context: mockContext },
    );
    const instance = wrapper.instance();
    instance.getErrors = jest.fn(value => (value === 'value1' ? 'error1' : 'error2'));
    wrapper.setProps({
      value: 'a new value',
    });
    expect(mockContext.updateFieldValidationState).toHaveBeenCalledWith('field1', false);
  });

  describe('Errors', () => {
    it('Should render correctly', () => {
      const wrapper = shallow(<FieldwithValidation name="field1" value="" />, {
        context: mockContext,
        disableLifecycleMethods: true,
      });
      const instance = wrapper.instance();
      instance.getErrorsToShow = jest.fn(() => ({
        rule: 'some_rule',
        message: 'There is an error',
      }));
      instance.componentDidMount();
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it("Should not be shown if the the field was registered empty and hasn't changed and the form was not submitted", () => {
      mockContext.isFormSubmitted = jest.fn(() => false);
      const wrapper = shallow(<FieldwithValidation name="field1" value="" />, {
        context: mockContext,
        disableLifecycleMethods: true,
      });
      const instance = wrapper.instance();
      instance.getErrors = jest.fn(() => ({ rule: 'some_rule', message: 'There is an error' }));
      instance.componentDidMount();
      expect(instance.getErrorsToShow()).toBeUndefined();
    });

    it("Should be shown if the field was registered empty and hasn't changed but the form was submitted", () => {
      mockContext.isFormSubmitted = jest.fn(() => true);
      const wrapper = shallow(<FieldwithValidation name="field1" value="" />, {
        context: mockContext,
        disableLifecycleMethods: true,
      });
      const instance = wrapper.instance();
      instance.getErrors = jest.fn(() => ({ rule: 'some_rule', message: 'There is an error' }));
      instance.componentDidMount();
      expect(instance.getErrorsToShow()).toEqual({
        message: 'There is an error',
        rule: 'some_rule',
      });
    });

    it("Should be shown if the field was registered filled and hasn't changed even if the form was not submitted", () => {
      mockContext.isFormSubmitted = jest.fn(() => false);
      const wrapper = shallow(<FieldwithValidation name="field1" value="a value" />, {
        context: mockContext,
        disableLifecycleMethods: true,
      });
      const instance = wrapper.instance();
      instance.getErrors = jest.fn(() => ({ rule: 'some_rule', message: 'There is an error' }));
      instance.componentDidMount();
      expect(instance.getErrorsToShow()).toEqual({
        message: 'There is an error',
        rule: 'some_rule',
      });
    });
  });

  describe('Required field', () => {
    it('Non-empty strings are valid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'required' }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = undefined;
      expect(instance.getErrors('asd')).toEqual(expectedError);
    });

    it('Empty strings are invalid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'required' }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = { rule: 'required' };
      expect(instance.getErrors('')).toEqual(expectedError);
    });

    it('Empty arrays are invalid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'required' }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = { rule: 'required' };
      expect(instance.getErrors([])).toEqual(expectedError);
    });

    it('Non-empty arrays are valid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'required' }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = undefined;
      expect(instance.getErrors(['asd'])).toEqual(expectedError);
    });
  });

  describe('Integer with mininum value', () => {
    it('Values greater than the minimum are valid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'min', value: 3 }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = undefined;
      expect(instance.getErrors('5')).toEqual(expectedError);
    });

    it('Values lower than the minimum are invalid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'min', value: 3 }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = { rule: 'min', value: 3 };
      expect(instance.getErrors('1')).toEqual(expectedError);
    });

    it('Values with the exact same value as the minimum are valid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'min', value: 3 }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = undefined;
      expect(instance.getErrors('3')).toEqual(expectedError);
    });

    it('Non numbers are valid', () => {
      const wrapper = shallow(
        <FieldwithValidation name="field1" validators={[{ rule: 'min', value: 3 }]} />,
        { context: mockContext },
      );
      const instance = wrapper.instance();
      const expectedError = { rule: 'min', value: 3 };
      expect(instance.getErrors('a string')).toEqual(expectedError);
    });
  });
});
