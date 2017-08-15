import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

class BasicInput extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      users: [],
      fields: {}
    }
  }

  onFormSubmit (e) {
    e.preventDefault();
    const user = this.state.fields;

    this.setState({
      users: [...this.state.users, user],
      fields: {
        name: undefined,
        email: undefined
      }
    }, () => console.log(this.state));
  }

  handleInputChange (e) {
    const fields = Object.assign({}, this.state.fields, {
      [e.target.name]: e.target.value
    });

    this.setState({ fields }, () => console.log(this.state));
  }

  render () {
    const userList = this.state.users.map((user, i) =>
        <li key={i}>{user.name} ({user.email})</li>
      );

    return (
      <div>
        <h1>Sing Up Sheet</h1>
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <input
            type='text'
            placeholder='name'
            name='name'
            value={this.state.fields.name}
            onChange={this.handleInputChange.bind(this)}/>

          <input
            type='text'
            placeholder='email'
            name='email'
            value={this.state.fields.email}
            onChange={this.handleInputChange.bind(this)}/>

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
