import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

class BasicInput extends React.Component {
  onFormSubmit (e) {
    e.preventDefault();
    console.log(this.inputNameRef.value);
  }

  render () {
    return (
      <div>
        <h1>Sing Up Sheet</h1>
        <form onSubmit={this.onFormSubmit.bind(this)}>
          <input type='text'
            placeholder='name'
            ref={el => this.inputNameRef = el}/>

            <button type='submit'>Submit</button>
        </form>
      </div>
    );
  }
}

BasicInput.displayName = __filename.split('/').slice(-1)[0];

module.exports = BasicInput;
