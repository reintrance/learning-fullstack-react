
(function () {
  'use strict';

  const UPDATE_TIMERS_INTERVAL_MS = 5000;

  class TimerDashboard extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        timers: [],
        serverError: {},
        submitErrors: []
      };

      this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
      this.handleUpdateFormSubmit = this.handleUpdateFormSubmit.bind(this);
      this.handleRemoveClick = this.handleRemoveClick.bind(this);
      this.handleStartClick = this.handleStartClick.bind(this);
      this.handleStopClick = this.handleStopClick.bind(this);
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

    handleStartClick (timerId) {
      this.startTimer(timerId);
    }

    handleStopClick (timerId) {
      this.stopTimer(timerId);
    }

    handleServerError (error) {
      this.setState({
        serverError: error
      });
    }

    startTimer (timerId) {
      const now = Date.now();
      const updatedTimers = this.state.timers.map(timer => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now
          });
        } else {
          return timer;
        }
      });

      this.setState({
        timers: updatedTimers
      });

      client.startTimer({
        id: timerId,
        start: now
      }).catch(this.handleServerError.bind(this));;
    }

    stopTimer (timerId) {
      var now = Date.now();
      const updatedTimers = this.state.timers.map(timer => {
        if (timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null
          });
        } else {
          return timer;
        }
      });

      this.setState({
        timers: updatedTimers
      });

      client.stopTimer({
        id: timerId,
        stop: now
      }).catch(this.handleServerError.bind(this));;
    }

    createTimer (timer) {
      const newTimer = helpers.newTimer(timer);
      this.setState({
        timers: this.state.timers.concat(newTimer)
      });

      client.createTimer(newTimer).catch(this.handleServerError.bind(this));
    }

    updateTimer (attrs) {
      let updatedTimer;
      const updatedTimers = this.state.timers.map(timer => {
        if (timer.id === attrs.id) {
          updatedTimer = Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project
          });
          return updatedTimer;
        } else {
          return timer;
        }
      });

      this.setState({
        timers: updatedTimers
      });

      client.updateTimer(updatedTimer).catch(this.handleServerError.bind(this));
    }

    deleteTimer (timerId) {
      this.setState({
        timers: this.state.timers.filter(timer => timer.id !== timerId)
      });

      client.deleteTimer({
        id: timerId
      }).catch(this.handleServerError.bind(this));;
    }

    loadTimersFromServer () {
      client.getTimers(timers => {
        this.setState({ timers });
      }).catch(this.handleServerError.bind(this));
    }

    componentDidMount () {
      this.loadTimersFromServer();
      this.updateTimersInterval = setInterval(this.loadTimersFromServer.bind(this), UPDATE_TIMERS_INTERVAL_MS);
    }

    componentWillUnmount () {
      clearInterval(this.updateTimersInterval);
    }

    render () {
      return (
        <div>
          <ErrorNotification error={this.state.serverError.message} />
          <div className='ui three column centered grid'>
            <div className='column'>
              <EditableTimerList
                timers={this.state.timers}
                onFormSubmit={this.handleUpdateFormSubmit}
                onRemoveClick={this.handleRemoveClick}
                onStartClick={this.handleStartClick}
                onStopClick={this.handleStopClick}
              />
              <ToggleableTimerForm
                onFormSubmit={this.handleCreateFormSubmit}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  class ErrorNotification extends React.Component {
    render () {
      if (this.props.error) {
        return (
          <div className="ui inverted red segment">
            <p>{this.props.error}</p>
          </div>
        );
      } else {
        return null;
      }
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
            onStartClick={this.props.onStartClick}
            onStopClick={this.props.onStopClick}
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
            onStartClick={this.props.onStartClick}
            onStopClick={this.props.onStopClick}
          />
        );
      }
    }
  }

  class TimerForm extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        values: {
          title: props.title,
          project: props.project
        },
        validationErrors: []
      }

      this.inputs = {};

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit () {
      const values = {
        title: this.inputs.title.value,
        project: this.inputs.project.value
      };
      this.setState({values});

      const isValid = this.validate();

      if (isValid) {
        const valuesToSubmit = Object.assign({
          id: this.props.id
        }, values);

        this.props.onFormSubmit(valuesToSubmit);
      }
    }

    validate () {
      const fields = ['title', 'project'];
      const validationErrors = fields.filter(field => {
        return !this.inputs[field].value;
      });

      this.setState({
        validationErrors
      });

      return !validationErrors.length;
    }

    render () {
      const submitText = this.props.id ? 'Update' : 'Create';

      return (
        <div className='ui centered card'>
          <div className='content'>
            <div className={this.state.validationErrors.length ? "ui error form" : 'ui form'}>
              <InputField
                isValid={this.state.validationErrors.indexOf('title') === -1}
                label='Title'
                value={this.state.values.title}
                inputRef={el => this.inputs.title = el}
              />
              <InputField
                isValid={this.state.validationErrors.indexOf('project') === -1}
                label='Project'
                value={this.state.values.project}
                inputRef={el => this.inputs.project = el}
              />
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

  class InputField extends React.Component {
    render () {
      if (this.props.isValid) {
        return (
          <div className='field'>
            <label>{this.props.label}</label>
            <input type='text' ref={this.props.inputRef} defaultValue={this.props.value}/>
          </div>
        );
      } else {
        return (
          <div className='field error'>
            <div className="ui error message">
              Value for {this.props.label} is not correct
            </div>
            <label>{this.props.label}</label>
            <input type='text' ref={this.props.inputRef} defaultValue={this.props.value}/>
          </div>
        );
      }
    }
  }

  class Timer extends React.Component {
    constructor (props) {
      super(props);

      this.state = {
        isControlsVisible: false
      };

      this.handleRemoveClick = this.handleRemoveClick.bind(this);
      this.handleStartClick = this.handleStartClick.bind(this);
      this.handleStopClick = this.handleStopClick.bind(this);
      this.showControls = this.showControls.bind(this);
      this.hideControls = this.hideControls.bind(this);
    }

    handleRemoveClick () {
      this.props.onRemoveClick(this.props.id)
    }

    handleStartClick () {
      this.props.onStartClick(this.props.id)
    }

    handleStopClick () {
      this.props.onStopClick(this.props.id)
    }

    componentDidMount () {
      this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    }

    componentWillUnmount () {
      clearInterval(this.forceUpdateInterval);
    }

    showControls () {
      this.setState({
        isControlsVisible: true
      });
    }

    hideControls () {
      this.setState({
        isControlsVisible: false
      });
    }

    render () {

      const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);

      return (
        <div
          className="ui centered card"
          onMouseEnter={this.showControls}
          onMouseLeave={this.hideControls}>
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
            <TimerControls
              isControlsVisible={this.state.isControlsVisible}
              onEditClick={this.props.onEditClick}
              onRemoveclick={this.handleRemoveClick}
            />
          </div>
          <TimerActionButton
            timerIsRunning={!!this.props.runningSince}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
        </div>
      );
    }
  }

  class TimerControls extends React.Component {
    render () {
      if (this.props.isControlsVisible) {
        return (
          <div className="extra content">
            <span className="right floated edit icon" onClick={this.props.onEditClick}>
              <i className="edit icon"></i>
            </span>
            <span className="right floated trash icon" onClick={this.props.onRemoveclick}>
              <i className="trash icon"></i>
            </span>
          </div>
        );
      } else {
        return <div>&nbsp;</div>;
      }
    }
  }

  class TimerActionButton extends React.Component {
    render () {
      if (this.props.timerIsRunning) {
        return (
          <div className="ui bottom attached red basic button" onClick={this.props.onStopClick}>
            Stop
          </div>
        );
      } else {
        return (
          <div className="ui bottom attached blue basic button" onClick={this.props.onStartClick}>
            Start
          </div>
        );
      }
    }
  }

  ReactDOM.render(<TimerDashboard />, document.getElementById('content'));
})()
