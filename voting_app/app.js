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