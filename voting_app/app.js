class Product extends React.Component {
    constructor (props) {
        super(props);

        this.handleUpVote = this.handleUpVote.bind(this);
    }

    handleUpVote () {
        this.props.onVote(this.props.id);
    }

    render () {
        return (
            <div className='item'>
                <div className='image'>
                    <img src={this.props.product_image_url} />
                </div>
                <div className='middle aligned content'>
                    <div className='header'>
                        <a onClick={this.handleUpVote}>
                            <i className='large caret up icon'></i>
                        </a>
                        {this.props.votes}
                    </div>
                    <div className='description'>
                        <a href='this.prop.url'>{this.props.title}</a>
                        <p>{this.props.description}</p>
                    </div>
                    <div className='extra'>
                        <span>Submitted by:</span>
                        <img className='ui avatar image'
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

    handleProductUpVote (id) {
        console.log(`Product with id ${id} just got upvote`);
    }

    render () {
        const products = MockData.map(product => {
            return (
                <Product
                    key={'product-' + product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    votes={product.votes}
                    url={product.url}
                    submitter_avatar_url={product.submitter_avatar_url}
                    product_image_url={product.product_image_url}
                    onVote={this.handleProductUpVote}
                />
            );
        });
        return (
            <div className='ui items'>
                {products}
            </div>
        );
    }
};

ReactDOM.render(<ProductList />, document.getElementById('content'));
