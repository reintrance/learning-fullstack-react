import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

class BasicButton extends React.Component {
  onButtonClick (e) {
    const btn = e.target
    console.log(`The user clicked ${btn.name}: ${btn.value}`);
  }

  render () {
    return (
      <div>
        <h1>What do you think of React?</h1>
        <button
          name='button-1'
          value='great'
          onClick={this.onButtonClick}>Great</button>
        <button
          name='button-2'
          value='amazing'
          onClick={this.onButtonClick}>Amazing</button>
      </div>
    )
  }
};

BasicButton.displayName = __filename.split('/').slice(-1)[0];

module.exports = BasicButton;
