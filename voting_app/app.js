class Product extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="item">
                <div className="image">
                    <img src={this.props.product_image_url} />
                </div>
                <div className="middle aligned content">
                    <div className="header">
                        <a>
                            <i className="large caret up icon"></i>
                        </a>
                        {this.props.votes}
                    </div>
                    <div className="description">
                        <a>{this.props.title}</a>
                        <p>{this.props.description}</p>
                    </div>
                    <div className="extra">
                        <span>Submitted by:</span>
                        <img className="ui avatar image"
                            src={this.props.submitter_avatar_url}/>
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
        const product = MockData[0];
        return (
            <div className='ui items'>
                <Product
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    votes={product.votes}
                    url={product.url}
                    submitter_avatar_url={product.submitter_avatar_url}
                    product_image_url={product.product_image_url}
                />
            </div>
        );
    }
};

ReactDOM.render(<ProductList />, document.getElementById('content'));
