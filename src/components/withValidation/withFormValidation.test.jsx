import React from 'react';
import PropTypes from 'prop-types';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import withFormValidation from './withFormValidation';
import withFieldValidation from './withFieldValidation';
// import ValidationFeedback from './ValidationFeedback';
import withFeedbackValidation from './withFeedbackValidation';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => Component => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = { ...Component.defaultProps, t: () => 'some translated stuff' };
    return Component;
  },
}));

// eslint-disable-next-line
const Form = ({ onFieldRegister, onFieldDeregister, onFieldChange, ...props }) => (
  <form {...props} />
);

const simulateChangeField = (element, value) => {
  const event = { target: { name: element.props().name, value } };
  element.simulate('change', event);
};

// eslint-disable-next-line
const Field = ({ valid, FormHelperTextProps, helperText, error, ...props }) => <input type="text" {...props} />;

const FormWithValidation = withFormValidation(Form);
const FieldwithValidation = withFieldValidation(Field);
const ValidationFeedback = withFeedbackValidation(() => <div />);

describe('withFormValidation', () => {
  it('should render correctly', () => {
    const wrapper = mount(<FormWithValidation onSubmit={jest.fn()} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('Registering fields', () => {
    it('should register validated fields', () => {
      const wrapper = mount(<FormWithValidation onSubmit={jest.fn()} />);
      const instance = wrapper.instance();

      instance.registerValidatedField('field1', true);
      instance.registerValidatedField('field2', false);

      wrapper.update();

      const { state } = instance;

      expect('field1' in state.validations).toBe(true);
      expect('field2' in state.validations).toBe(true);
      expect(state.validations.field1).toBe(true);
      expect(state.validations.field2).toBe(false);
    });

    it('should deregister validated fields', () => {
      const wrapper = mount(<FormWithValidation onSubmit={jest.fn()} />);
      const instance = wrapper.instance();

      instance.registerValidatedField('field1', false);
      instance.registerValidatedField('field2', true);

      instance.deregisterValidatedField('field2');
      wrapper.update();

      const { state } = instance;

      expect('field1' in state.validations).toBe(true);
      expect('field2' in state.validations).toBe(false);
    });
  });

  describe('Form errors', () => {
    it.only('Should not be shown if form was not submmited', () => {
      const wrapper = mount(
        <FormWithValidation onSubmit={jest.fn()} checkErrors={() => 'There are errors'}>
          <ValidationFeedback />
        </FormWithValidation>,
      );
      const instance = wrapper.instance();
      instance.setState({ formSubmitted: true });
      wrapper.update();
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Should be shown if when form is submitted', () => {
      const wrapper = mount(
        <FormWithValidation onSubmit={jest.fn()} checkErrors={() => 'There are errors'}>
          <ValidationFeedback />
        </FormWithValidation>,
      );
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Are not shown if there are not errors', () => {
      const wrapper = mount(
        <FormWithValidation onSubmit={jest.fn()} checkErrors={() => undefined}>
          <FieldwithValidation name="field1" id="field" value="1" />
          <ValidationFeedback />
        </FormWithValidation>,
      );
      const instance = wrapper.instance();
      expect(instance.isFormValid()).toBe(true);
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('Are not shown until a field is changed', () => {
      const wrapper = mount(
        <FormWithValidation onSubmit={jest.fn()} checkErrors={() => 'There are errors'}>
          <FieldwithValidation name="field1" id="field" value="1" />
          <ValidationFeedback />
        </FormWithValidation>,
      );
      const instance = wrapper.instance();
      expect(instance.isFormValid()).toBe(false);

      const fieldDomElement = wrapper.find('#field').last();
      simulateChangeField(fieldDomElement, 'still invalid');
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
describe('Submit', () => {
  it('Should call the main onSubmit function if the form is valid', () => {
    const onSubmitMock = jest.fn();
    const wrapper = mount(<FormWithValidation onSubmit={onSubmitMock} />);

    const instance = wrapper.instance();
    instance.isFormValid = jest.fn(() => true);

    wrapper.find('form').simulate('submit');
    expect(onSubmitMock).toHaveBeenCalled();
  });

  it('Should not call the main onSubmit function if the form is invalid', () => {
    const onSubmitMock = jest.fn();
    const wrapper = mount(<FormWithValidation onSubmit={onSubmitMock} />);

    const instance = wrapper.instance();
    instance.isFormValid = jest.fn(() => false);

    wrapper.find('form').simulate('submit');
    expect(onSubmitMock).not.toHaveBeenCalled();
  });
});
