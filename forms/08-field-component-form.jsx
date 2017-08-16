import React from 'react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';

const content = document.createElement('div');
document.body.appendChild(content);

class Field extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      value: this.props.value,
      error: ''
    };
  }

  componentWillReceiveProps({ value }) {
    this.setState({ value });
  }

  handleFieldChange (e) {
    const name = this.props.name;
    const value = e.target.value;
    const error = this.props.validate ? this.props.validate(value) : '';

    this.setState({ value, error });
    this.props.onChange({ name, value, error });
  }

  render () {
    return (
      <div>
        <input
          type='text'
          placeholder={this.props.placeholder}
          value={this.state.value}
          onChange={this.handleFieldChange.bind(this)}/>

        <span style={{color: 'red'}}>{this.state.error}</span>
      </div>
    )
  }
}

Field.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  validate: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

class BasicInput extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      users: [],
      fields: {
        name: '',
        email: ''
      },
      fieldErrors: {}
    }
  }

  onFormSubmit (e) {
    e.preventDefault();
    if (!this.validate()) {
      return;
    }

    const user = this.state.fields;

    this.setState({
      users: [...this.state.users, user],
      fields: {
        name: '',
        email: ''
      }
    });
  }

  handleInputChange ({name, value, error}) {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;

    fields[name] = value;
    fieldErrors[name] = error;

    this.setState({ fields, fieldErrors });
  }

  validate () {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errorMessages = Object.keys(fieldErrors).filter((field) => fieldErrors[field]);

    return fields.name && fields.email && !errorMessages.length;
  }

  render () {
    const userList = this.state.users.map((user, i) =>
        <li key={i}>{user.name} ({user.email})</li>
      );

    return (
      <div>
        <h1>Sing Up Sheet</h1>
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <Field
            placeholder='name'
            name='name'
            value={this.state.fields.name}
            onChange={this.handleInputChange.bind(this)}
            validate={(value) => (value ? '' : 'Name is required')}
          />

          <Field
            placeholder='email'
            name='email'
            value={this.state.fields.email}
            onChange={this.handleInputChange.bind(this)}
            validate={(value) => (isEmail(value) ? '' : 'Invalid email')}
          />

          <button type='submit'>Submit</button>
        </form>
        <div>
          <h3>Names</h3>
          <ul>
            {userList}
          </ul>
        </div>
      </div>
    );
  }
}

BasicInput.displayName = __filename.split('/').slice(-1)[0];

module.exports = BasicInput;
