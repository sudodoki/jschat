/** @jsx React.DOM */
module.exports = React.createClass({
  render: function(){
    var that = this;
    var user = function(meModel){
      if(meModel && meModel.get('id')){
        return <li>
          <a href="#" target="_self">{meModel.get('displayName') || meModel.get('gh_username')}</a>
        </li>;
      } else {
        return <li>
          <a href={window.host + "/auth/github?backUrl=" + encodeURIComponent(location.href)}  target="_self">Login with GitHub</a>
        </li> 
      }
    }
    return <nav className="navbar navbar-default" role="navigation">
      <div className="appName">
        <a className="navbar-brand" href="#" target="_self">JSchat</a>
      </div>
      
      <label htmlFor="handler-right" id="right" href="#" className="btn btn-default nav navbar-nav">⍣</label>
      <label htmlFor="handler-left" id="left" href="#" className="btn btn-default nav navbar-nav">☰</label>
      <ul>
        {user(this.props.me)}
      </ul>
    </nav>
  }
});
