(function () {
    'use strict';
    const DOWNVOTE_FLAG = '-';
    const UPVOTE_FLAG = '+';

    class Product extends React.Component {
        constructor (props) {
            super(props);

            this.handleUpVote = this.handleUpVote.bind(this);
            this.handleDownVote = this.handleDownVote.bind(this);
        }

        handleUpVote () {
            this.props.onUpVote(this.props.id);
        }

        handleDownVote () {
            this.props.onDownVote(this.props.id);
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
                            <a onClick={this.handleDownVote}>
                                <i className='large caret down icon'></i>
                            </a>
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
            super(props);

            this.state = {
                products: []
            };

            this.handleProductUpVote = this.handleProductUpVote.bind(this);
            this.handleProductDownVote = this.handleProductDownVote.bind(this);
        }

        // Changed it from componentDidMount to avoid double render, check if it causes problems in the future
        componentWillMount () {
            this.updateState();
        }

        handleProductUpVote (productId) {
            this.updateVoteCounter(productId, UPVOTE_FLAG);
        }

        handleProductDownVote (productId) {
            this.updateVoteCounter(productId, DOWNVOTE_FLAG);
        }

        updateVoteCounter (productId, voteFlag) {
            MockData.forEach(el => {
                if (el.id === productId) {
                    el.votes =  voteFlag === UPVOTE_FLAG ? el.votes + 1 : el.votes - 1;
                    return;
                }
            });

            this.updateState();
        }

        updateState () {
            const products = MockData.sort((a, b) => {
                return b.votes - a.votes;
            });

            this.setState({ products });
        }

        render () {
            const products = this.state.products.map(product => {
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
                        onUpVote={this.handleProductUpVote}
                        onDownVote={this.handleProductDownVote}
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
})();
