import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

class BasicInput extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      names: [],
      name: ''
    }
  }

  onFormSubmit (e) {
    e.preventDefault();
    const name = this.state.name;

    this.setState({
      names: [...this.state.names, name],
      name: ''
    });
  }

  handleNameChange (e) {
    const name = e.target.value;

    this.setState({ name });
  }

  render () {
    const namesList = this.state.names.map((name, i) =>
        <li key={i}>{name}</li>
      );

    return (
      <div>
        <h1>Sing Up Sheet</h1>
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <input
            type='text'
            placeholder='name'
            value={this.state.name}
            onChange={this.handleNameChange.bind(this)}
            ref={el => this.inputNameRef = el}/>

            <button type='submit'>Submit</button>
        </form>
        <div>
          <h3>Names</h3>
          <ul>
            {namesList}
          </ul>
        </div>
      </div>
    );
  }
}

BasicInput.displayName = __filename.split('/').slice(-1)[0];

module.exports = BasicInput;
