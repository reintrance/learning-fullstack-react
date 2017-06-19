class ProductList extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <div className='ui items'>
                Hey there!
            </div>
        );
    }
};

ReactDOM.render(<ProductList />, document.getElementById('content'));