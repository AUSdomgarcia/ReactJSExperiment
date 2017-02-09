import React, {Component} from 'react';

export class FilteredList extends Component {
    constructor(props){
        super(props);

        this.state = {
            arrayOnly: [],
            filtered: []
        };
    }

    componentWillMount(){
        
    }

    componentWillReceiveProps(nextProps){
        // console.log('>>>', typeof nextProps.data);
        if(this.state.arrayOnly !== nextProps.data ){
            this.setState( { arrayOnly: nextProps.data });
        }
    }

    filterList(event){
        let updatedList = this.state.arrayOnly;
        let scope = this;
        let filtered = [];
        let typed = event.target.value.trim();

        updatedList.map(function(data, index, arr){
            if( data.position.name.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.props.onFilter(filtered);

            } else if( data.rate_type.name.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.props.onFilter(filtered);
            }

            else if( data.department.name.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.props.onFilter(filtered);
            }

            else if( data.manhour_rate.toLowerCase().includes(typed)){
                filtered.push(data);
                scope.props.onFilter(filtered);
            }

        });

        if(event.target.value.length===0){
            scope.props.onFilter(filtered);
        }
        
        // updatedList = updatedList.filter(function(item){
        // return item.toLowerCase().search(
        //     event.target.value.toLowerCase()) !== -1;
        // });
        // this.setState({items: updatedList});
    }

    render(){
        return (
            <div>
                <input type="text" className="form-control" onChange={this.filterList.bind(this)} />
            </div>
        )
    }
}