import React, {Component} from 'react';

export class InnerLevel extends Component {

    constructor(props){
        super(props);
        this.state = {
            isManageBtn: true,
            isMenuBtn: false,
        }
    }

    componentDidMount(){
        // console.log('parent', this.props.parentData);
    }

    onManage(){
        this.setState({isManageBtn:false});
        this.setState({isMenuBtn:true});
    }

    render(){
        let mainElement = null;
        let curData = this.props.curData;
        let parentData = this.props.parentData;
        let scope = this;

        if(curData.level === this.props.level.toString()){
            mainElement = 
            <div>
                <div className="col-xs-6">
                    <span className="name">{curData.name}</span>
                </div>
                <div className="col-xs-6">
                    <div className="text-right">
                        <button type="button" className="btn btn-default" onClick={this.onManage.bind(this)}>Manage SubCategories</button>
                    </div>
                </div>
                <br className="clearfix"/>
            </div>
        }
        
        return (
            <div>
                {mainElement}

                {(function(scope){
                    if(scope.state.isMenuBtn){
                        return (
                            <ul>
                                { parentData.map(function(data){
                                    if(data.level==="3"){
                                        return (
                                            <li key={data.id}>
                                                <InnerLevel level={3} curData={data} parentData={parentData}/>
                                            </li>
                                            )
                                        }
                                } ) }
                            </ul>
                        )
                    }
                })(this)}

            </div>
        )
    }
}