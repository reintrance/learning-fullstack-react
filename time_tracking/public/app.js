
(function () {
  'use strict';

  class TimerDashboard extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        timers: [{
          "title": "Mow the lawn",
          "project": "House Chores",
          "elapsed": 5456099,
          "id": "0a4a79cb-b06d-4cb1-883d-549a1e3b66d7"
        },
        {
          "title": "Clear paper jam",
          "project": "Office Chores",
          "elapsed": 1273998,
          "id": "a73c1d19-f32d-4aff-b470-cea4e792406a"
        },
        {
          "title": "Ponder origins of universe",
          "project": "Life Chores",
          "id": "2c43306e-5b44-4ff8-8753-33c35adbd06f",
          "elapsed": 11750,
          "runningSince": 1456225941911
        }]
      };
    }

    render () {
      return (
        <div className='ui three column centered grid'>
          <div className='column'>
            <EditableTimerList
              timers={this.state.timers}
            />
            <ToggleableTimerForm />
          </div>
        </div>
      );
    }
  }

  class EditableTimerList extends React.Component {
    render () {
      const timers = this.props.timers.map(timer => {
        return (
          <EditableTimer
            key={timer.id}
            id={timer.id}
            title={timer.title}
            project={timer.project}
            elapsed={timer.elapsed}
            runningSince={timer.runningSince}
          />
        );
      });
      return (
        <div id='timers'>
          {timers}
        </div>
      );
    }
  }

  class ToggleableTimerForm extends React.Component {
    constructor (props) {
      super(props);
      this.state = {
        isOpen: false
      };

      this.handleFormOpen = this.handleFormOpen.bind(this);
    }

    handleFormOpen () {
      this.setState({
        isOpen: true
      });
    }

    render () {
      if (this.state.isOpen) {
        return (
          <TimerForm />
        );
      } else {
        return (
          <div className='ui basic content center aligned segment'>
            <button className='ui basic icon button'>
              <i className='plus icon' onClick={this.handleFormOpen}></i>
            </button>
          </div>
        );
      }
    }
  }

  class EditableTimer extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        editFormOpen: false
      };
    }

    render () {
      if (this.state.editFormOpen) {
        return (
          <TimerForm
            id={this.props.id}
            title={this.props.title}
            project={this.props.project}
          />
        );
      } else {
        return (
          <Timer
            id={this.props.id}
            title={this.props.title}
            project={this.props.project}
            elapsed={this.props.elapsed}
            runningSince={this.props.runningSince}
          />
        );
      }
    }
  }

  class TimerForm extends React.Component {
    render () {
      const submitText = this.props.title ? 'Update' : 'Create';

      return (
        <div className='ui centered card'>
          <div className='content'>
            <div className='ui form'>
              <div className='field'>
                <label>Title</label>
                <input type='text' defaultValue={this.props.title}/>
              </div>
              <div className='field'>
                <label>Project</label>
                <input type='text' defaultValue={this.props.project}/>
              </div>
              <div className='ui two bottom attached buttons'>
                <button className='ui basic blue button'>
                  {submitText}
                </button>
                <button className='ui basic red button'>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  class Timer extends React.Component {
    render () {
      const elapsedString = helpers.renderElapsedString(this.props.elapsed);

      return (
        <div className="ui centered card">
          <div className="content">
            <div className="header">
              {this.props.title}
            </div>
            <div className="meta">
              {this.props.project}
            </div>
            <div className="center aligned description">
              <h2>
                {elapsedString}
              </h2>
            </div>
            <div className="extra content">
              <span className="right floated edit icon">
                <i className="edit icon"></i>
              </span>
              <span className="right floated trash icon">
                <i className="trash icon"></i>
              </span>
            </div>
          </div>
          <div className="ui bottom attached blue basic button">
            Start
          </div>
        </div>
      );
    }
  }

  ReactDOM.render(<TimerDashboard />, document.getElementById('content'));
})()
