import { useState } from 'react';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { sendEmailRequest } from '../../actions/auth';
import { getEmailBody } from '../../utils/global.services';
import classes from './ContactForm.module.css';
import { fields, validateForm } from './ContactForm.service';

const ContactForm = ({
  auth: { emailLoading },
  setAlert,
  sendEmailRequest,
  subject = 'Vendor Portal Contact form Email'
}) => {
  const [formData, setFormData] = useState(
    fields.map((field) => ({
      value: '',
      isValid: true,
      ...field
    }))
  );

  const changeForm = (e) => {
    setFormData(
      formData.map((data) => {
        if (data.name === e.target.name) {
          data.value = e.target.value;
        }
        return data;
      })
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = validateForm(formData, setFormData);
    if (isValid) {
      const res = await sendEmailRequest({
        body: getEmailBody({ data: formData }),
        type: 'html',
        subject
      });

      if (res) {
        setFormData(
          formData.map((field) => {
            field.value = '';
            return field;
          })
        );
        setAlert(`We've received your email!`, 'success');
      } else {
        setAlert(
          'There was an error trying to send your message. Please try again.',
          'error'
        );
      }
    } else {
      setAlert('Some required fields are empty or incorrect', 'error');
    }
  };

  return (
    <section className={classes.contactContainer}>
      <h2 className={classes.contactHeader}>Contact Us</h2>
      <form className={classes.contactForm}>
        {formData.map((field) => (
          <input
            key={field.name}
            className={`${classes.contactInput} ${
              field.isValid ? '' : classes.contactInputError
            }`}
            type={field.type}
            placeholder={field.placeholder}
            value={formData.find((data) => data.name === field.name).value}
            name={field.name}
            onChange={changeForm}
          />
        ))}
        <button
          className={classes.contactSubmit}
          onClick={submitForm}
          disabled={emailLoading}
        >
          Submit
        </button>
      </form>
    </section>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { setAlert, sendEmailRequest })(
  ContactForm
);
