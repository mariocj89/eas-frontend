import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import withFeedbackValidation from './withFeedbackValidation';

const ValidationFeedback = withFeedbackValidation(() => <div />);

describe('withFeedbackValidation', () => {
  it('Should render the inner component correctly when has errors', () => {
    const wrapper = shallow(<ValidationFeedback />, {
      context: { getFormError: () => 'There is an error' },
    });
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("Should not render the inner component when doesn't have errors", () => {
    const wrapper = shallow(<ValidationFeedback />, { context: { getFormError: () => undefined } });
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
