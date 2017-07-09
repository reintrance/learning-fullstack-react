import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

class BasicButton extends React.Component {
  onGreatClick (e) {
    console.log('The user clicked button-1: great', e);
  }

  onAmazingClick (e) {
    console.log('The user clicked button-2: amazing', e);
  }

  render () {
    return (
      <div>
        <h1>What do you think of React?</h1>
        <button
          name='button-1'
          value='great'
          onClick={this.onGreatClick}>Great</button>
        <button
          name='button-2'
          value='amazing'
          onClick={this.onAmazingClick}>Amazing</button>
      </div>
    )
  }
};

BasicButton.displayName = __filename.split('/').slice(-1)[0];

module.exports = BasicButton;
