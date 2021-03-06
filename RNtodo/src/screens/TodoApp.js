import React, { Component } from 'react';
import { Content, Body, List, Spinner, Container, Header, Item, Left, Right, Input, ListItem, Text, Fab, Icon, CheckBox } from 'native-base';
import { View } from 'react-native';
import { FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Alert } from 'react-native';

import { fetchTodo, deleteTodo, updateTodo, getTodo } from '../actions/todo';

class TodoApp extends Component {
	constructor(){
		super()
		this.state = {
			search: ''
		}
	}

	componentDidMount(){
		this.props.dispatch(fetchTodo())
	}

	checkedButton(id, check){
		this.props.dispatch(updateTodo(id, {
			checked: !check
		}))
	}

	editButton(id){
		this.props.dispatch(getTodo(id))
		.then(() => this.props.navigation.navigate('Edit'))
	}

	deleteButton(todo, id){
		Alert.alert(
			'Delete Todo',
			'Deleting ' + todo,
			[
				{text: 'delete', onPress: () => this.props.dispatch(deleteTodo(id))}
			]
		)
	}

	render(){
		if(this.props.data.fetching){
			return(
				<Spinner />
			)
		}

		const Filter = this.props.data.todos.filter((item) => {
			return(item.title.toLowerCase().indexOf(this.state.search.toLowerCase())!==-1)
		})

		return(
			<Container>
				<Header searchBar noShadow style={{ backgroundColor: null }}>
					<Item regular rounded>
						<Icon name='ios-search' />
						<Input onChangeText={(search) => this.setState({search: search})} placeholder='Search' />
					</Item>
				</Header>
				<Content style={{ marginBottom: 50 }}>
					<List>
						<FlatList
						 data={Filter}
						 renderItem={({item}) => 
						 	<ListItem>
							 	<CheckBox 
								 onPress={() => this.checkedButton(item.id, item.checked)}
								 checked={item.checked} />
								<Body style={{ paddingLeft: 20, paddingRight: 20 }}>
								 	<Item>
										<Left>
											<Text style={{ textDecorationLine: item.checked? "line-through" : "none" }}>{item.title}</Text>
										</Left>
										<Right>
											<Text style={{ textDecorationLine: item.checked? "line-through" : "none" }}>{new Date(item.time).toLocaleString()}</Text>
										</Right>
									</Item>
							 		<Text style={{ textDecorationLine: item.checked? "line-through" : "none" }}>{item.comment}</Text>
								</Body>
								<View>
									<Icon style={{ color: 'black' }} type='Feather' name="edit" onPress={() => this.editButton(item.id)}/>
									{item.checked? <Icon style={{ color: 'red', marginTop: 20 }} name="trash" onPress={() => this.deleteButton(item.title, item.id)}/> : null}
								</View>
							</ListItem>
						}
						 keyExtractor={({id}, index) => index.toString()}
						/>
					</List>
				</Content>
				<Fab
				 active={8}
				 direction='up'
				 style={{ backgroundColor: '#2ecc71' }}
				 position='bottomRight'
				 onPress={() => {this.props.navigation.navigate('Add')}}
				>
					<Text style={{ fontWeight: 'bold' }}>+</Text>
				</Fab>
				<Fab
				 active={8}
				 direction='up'
				 style={{ backgroundColor: '#2ecc71' }}
				 position='bottomLeft'
				 onPress={() => {this.props.navigation.navigate('User')}}
				>
					<Icon type='Feather' name='users'/>
				</Fab>
				
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	data: state.todoReducer
});

export default connect(mapStateToProps)(TodoApp);