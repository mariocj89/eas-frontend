import React, { Component } from 'react';
import PropTypes from 'prop-types';
import values from 'object.values';

const withFormValidation = WrappedComponent => {
  class WithFormValidation extends Component {
    constructor(props) {
      super(props);
      this.state = {
        formSubmitted: false, // It's used to bypass changedFields when the form is submitted
        validations: {},
      };
    }

    getChildContext() {
      return {
        registerValidatedField: this.registerValidatedField.bind(this),
        deregisterValidatedField: this.deregisterValidatedField.bind(this),
        getFormError: this.getFormError.bind(this),
        updateFieldValidationState: this.updateFieldValidationState.bind(this),
        isFormSubmitted: this.isFormSubmitted.bind(this),
      };
    }

    onSubmit = e => {
      const { onSubmit } = this.props;
      this.setState({
        formSubmitted: true,
      });
      if (!this.isFormValid()) {
        e.preventDefault();
      } else {
        onSubmit(e);
      }
    };

    getFormError() {
      const { formSubmitted } = this.state;
      const { checkErrors } = this.props;
      return formSubmitted ? checkErrors() : undefined;
    }

    isFormValid = () => {
      const { checkErrors } = this.props;
      const { validations } = this.state;
      const validationsValues = values(validations);
      const fieldsValid = validationsValues.every(Boolean);
      const formValid = !checkErrors();
      return fieldsValid && formValid;
    };

    // eslint-disable-next-line react/destructuring-assignment
    isFormSubmitted = () => this.state.formSubmitted;

    triggerValidationChange = () => {
      const { onValidationChange } = this.props;
      if (onValidationChange) {
        const isValid = this.isFormValid();
        onValidationChange(isValid);
      }
    };

    registerValidatedField(name, valid) {
      this.updateFieldValidationState(name, valid);
    }

    updateFieldValidationState(name, valid) {
      this.setState(
        previousState => ({
          validations: {
            ...previousState.validations,
            ...{
              [name]: valid,
            },
          },
        }),
        () => {
          this.triggerValidationChange();
        },
      );
    }

    deregisterValidatedField(name) {
      const { onFieldDeregister } = this.props;
      this.setState(
        previousState => {
          const validations = Object.assign({}, previousState.validations);
          delete validations[name];
          return {
            validations,
          };
        },
        () => {
          if (onFieldDeregister) {
            onFieldDeregister(name);
          }
          this.triggerValidationChange();
        },
      );
    }

    render() {
      const { onSubmit, onFieldDeregister, onValidationChange, checkErrors, ...props } = this.props;
      return <WrappedComponent {...props} onSubmit={this.onSubmit} />;
    }
  }

  WithFormValidation.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onFieldDeregister: PropTypes.func,
    onValidationChange: PropTypes.func,
    checkErrors: PropTypes.func,
  };

  WithFormValidation.defaultProps = {
    onFieldDeregister: null,
    onValidationChange: null,
    checkErrors: () => {},
  };

  WithFormValidation.childContextTypes = {
    registerValidatedField: PropTypes.func,
    deregisterValidatedField: PropTypes.func,
    getFormError: PropTypes.func,
    updateFieldValidationState: PropTypes.func,
    isFormSubmitted: PropTypes.func,
  };

  return WithFormValidation;
};

export default withFormValidation;
