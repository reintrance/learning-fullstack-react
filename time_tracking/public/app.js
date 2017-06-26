
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

      this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
      this.handleUpdateFormSubmit = this.handleUpdateFormSubmit.bind(this);
      this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleCreateFormSubmit (timer) {
      this.createTimer(timer);
    }

    handleUpdateFormSubmit (timer) {
      this.updateTimer(timer)
    }

    handleRemoveClick (timerId) {
      this.deleteTimer(timerId)
    }

    createTimer (timer) {
      const newTimer = helpers.newTimer(timer);
      this.setState({
        timers: this.state.timers.concat(newTimer)
      });
    }

    updateTimer (attrs) {
      var updatedTimers = this.state.timers.map(timer => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project
          });
        } else {
          return timer;
        }
      });

      this.setState({
        timers: updatedTimers
      });
    }

    deleteTimer (timerId) {
      this.setState({
        timers: this.state.timers.filter(timer => timer.id !== timerId)
      })
    }

    render () {
      return (
        <div className='ui three column centered grid'>
          <div className='column'>
            <EditableTimerList
              timers={this.state.timers}
              onFormSubmit={this.handleUpdateFormSubmit}
              onRemoveClick={this.handleRemoveClick}
            />
            <ToggleableTimerForm
              onFormSubmit={this.handleCreateFormSubmit}
            />
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
            onFormSubmit={this.props.onFormSubmit}
            onRemoveClick={this.props.onRemoveClick}
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
      this.handleFormClose = this.handleFormClose.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormOpen () {
      this.setState({
        isOpen: true
      });
    }

    handleFormClose () {
      this.setState({
        isOpen: false
      });
    }

    handleFormSubmit (timer) {
      this.props.onFormSubmit(timer);
      this.setState({
        isOpen: false
      });
    }

    render () {
      if (this.state.isOpen) {
        return (
          <TimerForm
            onFormSubmit={this.handleFormSubmit}
            onFormClose={this.handleFormClose}
          />
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

      this.handleFormOpen = this.handleFormOpen.bind(this);
      this.handleFormClose = this.handleFormClose.bind(this);
      this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    handleFormOpen () {
      this.openForm();
    }

    handleFormClose () {
      this.closeForm();
    }

    handleFormSubmit (timer) {
      this.props.onFormSubmit(timer);
      this.closeForm();
    }

    openForm () {
      this.setState({
        editFormOpen: true
      });
    }

    closeForm () {
      this.setState({
        editFormOpen: false
      });
    }

    render () {
      if (this.state.editFormOpen) {
        return (
          <TimerForm
            id={this.props.id}
            title={this.props.title}
            project={this.props.project}
            onFormSubmit={this.handleFormSubmit}
            onFormClose={this.handleFormClose}
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
            onEditClick={this.handleFormOpen}
            onRemoveClick={this.props.onRemoveClick}
          />
        );
      }
    }
  }

  class TimerForm extends React.Component {
    constructor (props) {
      super(props);

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit () {
      this.props.onFormSubmit({
        id: this.props.id,
        title: this.refs.title.value,
        project: this.refs.project.value
      });
    }

    render () {
      const submitText = this.props.id ? 'Update' : 'Create';

      return (
        <div className='ui centered card'>
          <div className='content'>
            <div className='ui form'>
              <div className='field'>
                <label>Title</label>
                <input type='text' ref='title' defaultValue={this.props.title}/>
              </div>
              <div className='field'>
                <label>Project</label>
                <input type='text' ref='project' defaultValue={this.props.project}/>
              </div>
              <div className='ui two bottom attached buttons'>
                <button className='ui basic blue button' onClick={this.handleSubmit}>
                  {submitText}
                </button>
                <button className='ui basic red button' onClick={this.props.onFormClose}>
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
    constructor (props) {
      super(props);

      this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick () {
      this.props.onRemoveClick(this.props.id)
    }

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
              <span className="right floated edit icon" onClick={this.props.onEditClick}>
                <i className="edit icon"></i>
              </span>
              <span className="right floated trash icon" onClick={this.handleRemoveClick}>
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
