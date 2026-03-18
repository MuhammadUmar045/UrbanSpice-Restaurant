import { useEffect, useState } from "react";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
};

function SignupModal({ isOpen, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(initialForm);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      setForm(initialForm);
      setValidationErrors({});
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const errors = {};

    if (form.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (form.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    onSubmit(form);
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label="Signup form"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create an Account</h2>
          <button className="icon-close" onClick={onClose} aria-label="Close signup modal">
            x
          </button>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            aria-invalid={!!validationErrors.fullName}
            required
          />
          {validationErrors.fullName ? (
            <span className="form-error">{validationErrors.fullName}</span>
          ) : null}

          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!validationErrors.email}
            required
          />
          {validationErrors.email ? (
            <span className="form-error">{validationErrors.email}</span>
          ) : null}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={6}
            value={form.password}
            onChange={handleChange}
            aria-invalid={!!validationErrors.password}
            required
          />
          {validationErrors.password ? (
            <span className="form-error">{validationErrors.password}</span>
          ) : null}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignupModal;
