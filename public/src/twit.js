// PageContainer has 3 children
// SearchBox gets user requests, pipes them back to PageContainer
// Sidebar displays info for current user
// Timeline displays most recent commits for user

var SearchBox = React.createClass({
    getInitialState: function() {
        return { 
            error: false,
            user: {
              "avatar_url": "https://avatars.githubusercontent.com/u/8053315?v=3",
              "html_url": "https://github.com/rgscherf",
              "login": "rgscherf",
              "name": "Rob Scherf",
              "public_repos": 14,
              "commits": {}
            }
        };
    },
    keyDown: function(e) {
        if (e.key === 'Enter') {
            var s = e.target.value;
            this.loadCommentsFromServer(s);
        }
    },
    componentWillMount: function() {
      this.loadCommentsFromServer('rgscherf');
    },
    loadCommentsFromServer: function(query) {
        // var u = 'http://localhost:5000/index.php/twit/' + query;
        var u = 'https://phptwit.herokuapp.com/index.php/twit/' + query;
        $.ajax( u, {
            type: 'POST',
            dataType: 'json',
            crossDomain: true,
            contentType: "application/x-www-form-urlencoded",
            cache: false,
            success: function(data) {
                this.setState({user: data, error: false});
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(xhr);
                this.setState({error: true});
            }.bind(this)
        });
    },
    render: function() {
        var err = this.state.error ? "Could not find that github user!" : "";
        return (
            <div>
                <div className="searchBox shadow">
                    <div className="titleBox">
                        <div id="logo">
                            Twit
                        </div>
                        <div id="definition">
                            <i>V.  to taunt or ridicule <br/>with reference to anything embarrassing</i>
                        </div>
                    </div>
                    <div className="searchContainer">
                        <input type="text" 
                               placeholder="Find github user to twit" 
                               className="mainSearch" 
                               onKeyDown={this.keyDown}/>
                        <div className="searchError">
                            {err}
                        </div>
                    </div>
                </div>
                <ContentContainer user={this.state.user}/>
            </div>
        );
    }

});

var ContentContainer = React.createClass({
    render: function() {
        return (
            <div className="contentContainer">
                <Sidebar user={this.props.user}/>
                <Timeline commits={this.props.user.commits}/>
            </div>
        );
    }
});

var Sidebar = React.createClass({
    render: function() {
        return (
            <div className="sideBar shadow">
                <img src={this.props.user.avatar_url}></img>
                <div>
                    <span id="userName">{this.props.user.name}</span>
                </div>
                <div>
                    <span id="userUrl">
                        <a href={this.props.user.html_url}>{this.props.user.login}</a> - {this.props.user.public_repos} public repos
                    </span>
                </div>
            </div>
        );
    }
});

var Timeline = React.createClass({
    render: function() {
        var a = $.map(this.props.commits, function(e) {return e;});
        var c = $.map(a, function(elem) {
            return(
                <div className="twitCard shadow">
                    <div className="twitCardHeadline">
                        Commit to <a href={elem.repo_url}>{elem.repo_name}</a> at <a href={elem.commit_url}>{elem.created_at}</a>
                    </div>
                    <div className="twitCardBody">
                        {elem.commit_message}
                    </div>
                </div>
            );
        });
        return (
            <div className="timeline">
                {c}
            </div>
        );
    }
});

ReactDOM.render(
    <SearchBox />, 
    document.getElementById("app")
);