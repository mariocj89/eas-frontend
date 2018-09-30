import React, { Component } from 'react';
import PropTypes from 'prop-types';

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
      if (!this.isFormValid()) {
        e.preventDefault();
        this.setState({
          formSubmitted: true,
        });
      } else {
        this.props.onSubmit(e);
      }
    };

    getFormError() {
      const { formSubmitted } = this.state;
      console.log(
        'formSubmitted ? this.props.checkErrors()',
        formSubmitted,
        this.props.checkErrors(),
      );
      return formSubmitted ? this.props.checkErrors() : undefined;
    }

    isFormValid = () => {
      const validations = Object.values(this.state.validations);
      const fieldsValid = validations.every(Boolean);
      const formValid = !this.props.checkErrors();
      return fieldsValid && formValid;
    };

    isFormSubmitted = () => this.state.formSubmitted;

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

    triggerValidationChange = () => {
      if (this.props.onValidationChange) {
        const isValid = this.isFormValid();
        this.props.onValidationChange(isValid);
      }
    };

    deregisterValidatedField(name) {
      this.setState(
        previousState => {
          const validations = Object.assign({}, previousState.validations);
          delete validations[name];
          return {
            validations,
          };
        },
        () => {
          if (this.props.onFieldDeregister) {
            this.props.onFieldDeregister(name);
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
