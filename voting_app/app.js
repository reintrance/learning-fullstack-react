class Product extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="item">
                <div className="image">
                    <img src="https://facebook.github.io/react/img/logo.svg" />
                </div>
                <div className="middle aligned content">
                    <div className="description">
                        <a>ReactJS</a>
                        <p>Popular JS framework from Facebook</p>
                    </div>
                    <div className="extra">
                        <span>Submitted by:</span>
                        <img className="ui avatar image"
                            src="http://findicons.com/files/icons/1072/face_avatars/300/i05.png"/>
                    </div>
                </div>
            </div>
        );
    }
};

class ProductList extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className='ui items'>
                <Product />
            </div>
        );
    }
};

ReactDOM.render(<ProductList />, document.getElementById('content'));
