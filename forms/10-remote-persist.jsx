import React from 'react';
import PropTypes from 'prop-types';
import isEmail from 'validator/lib/isEmail';
import Core from './api/core.json';
import Electives from './api/electives.json';

const content = document.createElement('div');
document.body.appendChild(content);

const Courses = {
  core: Core,
  electives: Electives,
};

function apiClient(department) {
  return {
    then: function (cb) {
      setTimeout(() => { cb(Courses[department]); }, 1000);
    },
  };
}

apiClient.loadUsers = function () {
  return {
    then: function (cb) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      setTimeout(() => cb(users));
    }
  };
}

apiClient.saveUsers = function (people) {
  const success = !!(this.count++ % 2);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!success) return reject({ success });

      localStorage.setItem('users', JSON.stringify(people));
      return resolve({ success });
    }, 1000);
  });
};

apiClient.count = 1;

class CourseSelect extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      department: '',
      course: '',
      courses: [],
      _loading: false
    };
  }

  componentWillReceiveProps ({ department, course }) {
    this.setState({ department, course });
  }

  handleSelectDepartment (e) {
    const department = e.target.value;
    const course = '';
    this.setState({ department, course });

    this.props.onChange({ name: 'department', value: department });
    this.props.onChange({ name: 'course', value: course });

    if (department) {
      this.fetch(department);
    }
  }

  fetch (department) {
    this.setState({
      _loading: true,
      courses: []
    });

    apiClient(department).then((courses) => {
      this.setState({
        _loading: false,
        courses
      });
    });
  }

  renderDepartmentSelect () {
    return (
      <select
        name="department"
        value={this.state.department}
        onChange={this.handleSelectDepartment.bind(this)}
      >
        <option value=''>Which department?</option>
        <option value='core'>Core</option>
        <option value='electives'>Electives</option>
      </select>
    );
  }

  handleSelectCourse (e) {
    const course = e.target.value;
    this.setState({ course });
    this.props.onChange({
      name: 'course',
      value: course
    });
  }

  renderCourseSelect () {
    if (this.state._loading) {
      return (
        <img src='/img/loading.gif' alt='loading'/>
      );
    }

    if (!this.state.department) {
      return (<span></span>);
    }

    return (
      <select name='course'
        value={this.state.course}
        onChange={this.handleSelectCourse.bind(this)}
      >
        {
          [<option value='' key='no-course'>Which course?</option>,
          ...this.state.courses.map((course, i) => (
            <option value={course} key={i}>
              {course}
            </option>
          ))]
        }
      </select>
    );
  }

  render () {
    return (
      <div>
        <div>
          {this.renderDepartmentSelect()}
        </div>
        <div>
          {this.renderCourseSelect()}
        </div>
      </div>
    );
  }
}

CourseSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  department: PropTypes.string,
  course: PropTypes.string
}

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
      fieldErrors: {},
      _loading: false,
      _saveStatus: 'READY'
    }
  }

  onFormSubmit (e) {
    e.preventDefault();
    if (!this.validate()) {
      return;
    }

    const users = [...this.state.users, this.state.fields];

    this.setState({
      _saveStatus: 'SAVING'
    });

    apiClient.saveUsers(users).then(() => {
      this.setState({
        users,
        fields: {
          name: '',
          email: '',
          department: '',
          course: ''
        },
        _saveStatus: 'SUCCESS'
      });
    }).catch((err) => {
      console.log(err);
      this.setState({
        _saveStatus: 'ERROR'
      });
    });


  }

  handleInputChange ({name, value, error}) {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;

    fields[name] = value;
    fieldErrors[name] = error;

    this.setState({
      fields,
      fieldErrors,
      _saveStatus: 'READY'
    });
  }

  validate () {
    const fields = this.state.fields;
    const fieldErrors = this.state.fieldErrors;
    const errorMessages = Object.keys(fieldErrors).filter((field) => fieldErrors[field]);

    return fields.name && fields.email && fields.course && fields.department && !errorMessages.length;
  }

  componentWillMount () {
    this.setState({
      _loading: true
    });

    apiClient.loadUsers().then((users) => {
      this.setState({
        _loading: false,
        users
      });
    });
  }

  render () {
    if (this.state._loading) {
      return (
        <img src='/img/loading.gif' alt='loading'/>
      );
    }

    const userList = this.state.users.map(({ name, email, department, course}, i) =>
        <li key={i}>{[ name, email, department, course ].join(' - ')}</li>
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

          <CourseSelect
            department={this.state.fields.department}
            course={this.state.fields.course}
            onChange={this.handleInputChange.bind(this)}
          />

          {{
            SAVING: <input value='Saving...' type='submit' disabled/>,
            SUCCESS: <input value='Saved!' type='submit' disabled/>,
            ERROR: <input value='Save failed - Retry?' type='submit' disabled={!this.validate()}/>,
            READY: <input value='Submit' type='submit' disabled={!this.validate()}/>
          }[this.state._saveStatus]}
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
