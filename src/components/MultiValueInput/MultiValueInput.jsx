import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

import MultiValueDisplay from '../MultiValueDisplay/MultiValueDisplay';

class MultiValueInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: '',
    };
  }

  onCurrentValueChange = e => {
    const { delimiters } = this.props;
    const { value } = e.target;
    const regexFromMyArray = new RegExp(delimiters.join('|\\'), 'gi');
    if (regexFromMyArray.test(value)) {
      const values = value
        .split(regexFromMyArray)
        .map(val => val.trim())
        .filter(Boolean);
      this.addValues(values);
    } else {
      this.setState({
        currentValue: e.target.value,
      });
    }
  };

  onValueDelete = value => {
    const values = this.props.value;
    const indexToDelete = values.indexOf(value);
    const clonedValues = values.slice();
    clonedValues.splice(indexToDelete, 1);
    const event = { target: { name: this.props.name, value: clonedValues } };
    this.props.onChange(event);
  };

  addValues = newValues => {
    const { value: values } = this.props;
    const event = { target: { name: this.props.name, value: values.concat(newValues) } };
    this.props.onChange(event);
    this.setState({ currentValue: '' });
  };

  render() {
    const {
      value: values,
      labelDisplayList,
      messageEmpty,
      'data-component': dataComponent,
      ...rest
    } = this.props;
    const { delimiters, onChange, ...extra } = rest;
    return (
      <div data-component={dataComponent}>
        <TextField
          onChange={this.onCurrentValueChange}
          type="text"
          margin="normal"
          value={this.state.currentValue}
          {...extra}
        />
        <MultiValueDisplay
          label={labelDisplayList}
          values={values}
          messageEmpty={messageEmpty}
          allowDelete
          onDelete={this.onValueDelete}
        />
      </div>
    );
  }
}

MultiValueInput.propTypes = {
  label: PropTypes.string.isRequired,
  labelDisplayList: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  messageEmpty: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  delimiters: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  'data-component': PropTypes.string,
};

MultiValueInput.defaultProps = {
  delimiters: ['Enter', ','],
  value: [],
  'data-component': '',
};

export default MultiValueInput;
