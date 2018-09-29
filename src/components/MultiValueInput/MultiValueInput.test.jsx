import React from 'react';
import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import MultiValueInput from './MultiValueInput';

describe('MultiValueInput', () => {
  beforeEach(() => {
    Math.random = jest.fn(() => 1);
  });

  it('Should render correctly without values', () => {
    const wrapper = shallow(
      <MultiValueInput
        name="field1"
        label="Input label"
        labelDisplayList="Selected Items"
        messageEmpty="No items selected"
        onChange={() => {}}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Should render correctly with values', () => {
    const wrapper = shallow(
      <MultiValueInput
        label="Input label"
        name="field1"
        labelDisplayList="Selected Items"
        messageEmpty="No items selected"
        value={['value 1', 'value 2']}
        onChange={() => {}}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('Pasting a comma separated list of values should return trimmed values', () => {
    const onChangeMock = jest.fn();
    const wrapper = mount(
      <MultiValueInput
        label="Input label"
        name="field1"
        labelDisplayList="Selected Items"
        messageEmpty="No items selected"
        onChange={onChangeMock}
        data-component="MultiValueInput__field"
        inputProps={{ 'data-component': 'MultiValueInput__field-input' }}
      />,
    );
    const input = wrapper.find('input');
    const event = { target: { name: 'field1', value: ' Value 1, Value 2   ,   ,,' } };
    input.simulate('change', event);
    const expectedEvent = { target: { name: 'field1', value: ['Value 1', 'Value 2'] } };
    expect(onChangeMock).toHaveBeenCalledWith(expectedEvent);
  });

  it('Should trimm values', () => {
    const onChangeMock = jest.fn();
    const wrapper = mount(
      <MultiValueInput
        label="Input label"
        name="field1"
        labelDisplayList="Selected Items"
        messageEmpty="No items selected"
        onChange={onChangeMock}
        data-component="MultiValueInput__field"
        inputProps={{ 'data-component': 'MultiValueInput__field-input' }}
      />,
    );
    const input = wrapper.find('input');
    const event = { target: { name: 'field1', value: ' Value 1, Value 2   ,   ,,' } };
    input.simulate('change', event);
    const expectedEvent = { target: { name: 'field1', value: ['Value 1', 'Value 2'] } };
    expect(onChangeMock).toHaveBeenCalledWith(expectedEvent);
  });

  it('Should not mutate the original value when values are added', () => {
    const onChangeMock = jest.fn();
    const initialValue = [];
    const wrapper = mount(
      <MultiValueInput
        label="Input label"
        name="field1"
        labelDisplayList="Selected Items"
        messageEmpty="No items selected"
        value={initialValue}
        onChange={onChangeMock}
        data-component="MultiValueInput__field"
        inputProps={{ 'data-component': 'MultiValueInput__field-input' }}
      />,
    );
    const input = wrapper.find('input');
    const event = { target: { name: 'field1', value: ' Value 1,' } };
    input.simulate('change', event);
    const expectedEvent = { target: { name: 'field1', value: ['Value 1'] } };
    expect(onChangeMock).toHaveBeenCalledWith(expectedEvent);
    expect(initialValue).toEqual([]);
  });

  it('Should not mutate the original value when values are removed', () => {
    const onChangeMock = jest.fn();
    const initialValue = ['Value 1'];
    const wrapper = mount(
      <MultiValueInput
        label="Input label"
        name="field1"
        labelDisplayList="Selected Items"
        messageEmpty="No items selected"
        value={initialValue}
        onChange={onChangeMock}
        data-component="MultiValueInput__field"
        inputProps={{ 'data-component': 'MultiValueInput__field-input' }}
      />,
    );
    expect(toJson(wrapper)).toMatchSnapshot();
    wrapper.find('svg').simulate('click');
    const expectedEvent = { target: { name: 'field1', value: [] } };
    expect(onChangeMock).toHaveBeenCalledWith(expectedEvent);
    expect(initialValue).toEqual(['Value 1']);
  });
});
