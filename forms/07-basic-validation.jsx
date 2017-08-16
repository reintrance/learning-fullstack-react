import React from 'react';
import isEmail from 'validator/lib/isEmail';

const content = document.createElement('div');
document.body.appendChild(content);

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
    const user = this.state.fields;
    const fieldErrors = this.validate(user);
    this.setState({ fieldErrors });

    if (Object.keys(fieldErrors).length) {
      return;
    }

    this.setState({
      users: [...this.state.users, user],
      fields: {
        name: '',
        email: ''
      }
    });
  }

  handleInputChange (e) {
    const fields = Object.assign({}, this.state.fields, {
      [e.target.name]: e.target.value
    });

    this.setState({ fields });
  }

  validate ({name, email}) {
    const errors = {};

    if (!name) {
      errors.name = 'Name is required.';
    }

    if (!email) {
      errors.email = 'Email is required.';
    }

    if (email && !isEmail(email)) {
      errors.email = 'Invalid email';
    }

    return errors;
  }

  render () {
    const userList = this.state.users.map((user, i) =>
        <li key={i}>{user.name} ({user.email})</li>
      );

    return (
      <div>
        <h1>Sing Up Sheet</h1>
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <div>
            <input
              type='text'
              placeholder='name'
              name='name'
              value={this.state.fields.name}
              onChange={this.handleInputChange.bind(this)}/>

            <span style={{color: 'red'}}>{this.state.fieldErrors.name}</span>
          </div>

          <div>
            <input
              type='text'
              placeholder='email'
              name='email'
              value={this.state.fields.email}
              onChange={this.handleInputChange.bind(this)}/>

            <span style={{color: 'red'}}>{this.state.fieldErrors.email}</span>
          </div>

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
