import React,{ Component } from 'react';
import { Container, Col, Form,
  FormGroup, Label, Input,
  Button, ListGroupItem,
  ListGroup,Row,ButtonGroup,
  ModalHeader,ModalBody,ModalFooter,Modal,
  Alert
} from 'reactstrap';

const styleCss = {
    container:{
        textAlign:"left",
    },
    buttonGroup:{
        float:"right",
    },
    buttonRight:{
        marginLeft:10,
        borderRadius:3
    },
    link:{
        fontSize:"1.2em",
        color:"#3498db"
    },
    alert:{
        overflow: "hidden",
        position: "fixed",
        bottom: 0,
        width: "100%",
        left:0
    }
}


class Customer extends Component {

constructor(props) {
    super(props);
    this.state = {
            isLoading: true,
            customers: [],
            customerDetail:null,
            error: null,
            modal: false,
            alert:false,
            message:null,
            newCustomer:{
                email:null,
                is_married: 1,
                name: null,
                password: null,
                gender: "male",
                address: null,
                customer_id:0
                },
            isNew:false
         };

    this.toggleModal = this.toggleModal.bind(this);
    this.deleteData = this.deleteData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggleCondition = this.toggleCondition.bind(this);
    this.createCustomerData = this.createCustomerData.bind(this);
    this.updateCustomerData = this.updateCustomerData.bind(this);
  }


 componentDidMount() {
     this.fetchListData();
  }

  fetchListData(){
    const apiUrl = 'http://localhost:9000/customer/';
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                customers: data.result,
                isLoading: false,
            });

            console.log('This is your data', data);
            });
  }

  deleteData(id){
    const apiUrl = `http://localhost:9000/customer/${id}`;
     fetch(apiUrl,{
         method:'delete'
     })
        .then((response) => response.json())
        .then((data) => {
            console.log('message delete', data);
            this.fetchListData();
            this.showAlert(data.status.message);
            });
  }

  fetchDetailData(id){
    const apiUrl = `http://localhost:9000/customer/${id}`;
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                customerDetail:data.result
            });

            console.log('This is your data', data);
            });
  }

  createCustomerData(){
      console.log("detail data",this.state.customerDetail);
      const apiUrl = `http://localhost:9000/customer/`;
     fetch(apiUrl,{
         method:'post',
         headers: {
                'Content-Type': 'application/json',
            },
         body: JSON.stringify(this.state.customerDetail),
     })
        .then((response) => response.json())
        .then((data) => {
            console.log('create customer', data.result);
            this.fetchListData();
            this.showAlert(data.status.message);
            this.toggleCondition();
            });
  }

  updateCustomerData(customerDetail){
      if(customerDetail){
      console.log("detail data",this.state.customerDetail);
      const apiUrl = `http://localhost:9000/customer/${customerDetail.customer_id}`;
     fetch(apiUrl,{
         method:'put',
         headers: {
                'Content-Type': 'application/json',
            },
         body: JSON.stringify(this.state.customerDetail),
     })
        .then((response) => response.json())
        .then((data) => {
            console.log('update customer', data.result);
            this.fetchListData();
            this.showAlert(data.status.message);
            this.toggleCondition();
            });
      }

  }

  showAlert(msg){
      this.setState({alert:true,message:msg},()=>{
      window.setTimeout(()=>{
        this.setState({alert:false})
      },2000)
    });

  }


  toggleModal(id) {
    if(id > 0 || id !== undefined){
           this.fetchDetailData(id);
    }else{
         this.setState({
                customerDetail:this.state.newCustomer,
                isNew:true
            });
    }
    this.toggleCondition();

  }

  toggleCondition(){
    this.setState(state => ({
      modal: !state.modal
    }));
    this.fetchListData();
  }

  onChange(data){
      let value = data.target.value;
      let name = data.target.name;

      this.setState({
          customerDetail:{...this.state.customerDetail,[name]:value}
      });
  }



  render() {
    const {isLoading,customers,error,modal,customerDetail,alert,message,isNew} = this.state;
    console.log("detail",customerDetail);
    return (
      <Container style={styleCss.container}>
         <h2>Customer</h2>
         <Row lg="12" ><Button color="primary" onClick={()=>this.toggleModal()}>Add New Customer</Button></Row>
         <br/>
         <Row lg="12">
            <Col lg="12">
            {isLoading?<div>please waitt ...</div>:<ListGroup>
                {customers.map(customer=>{
                    return(<ListGroupItem tag="a" href="#" action>
                    <ButtonGroup>
                        <span style={styleCss.link}>{customer.name}</span>
                    </ButtonGroup>
                    <ButtonGroup style={styleCss.buttonGroup}>
                        <Button style={styleCss.buttonRight} onClick={()=>this.toggleModal(customer.customer_id)}>Update</Button>
                        <Button color="danger" style={styleCss.buttonRight} onClick={()=>this.deleteData(customer.customer_id)}>Delete</Button>
                    </ButtonGroup>
                 </ListGroupItem>);
                })}
            </ListGroup>}
            </Col>
         </Row>
         <Modal isOpen={modal} toggle={this.toggleCondition}>
            <ModalHeader toggle={this.toggleCondition}>{isNew?`Add New Customer`:`Customer Detail`}</ModalHeader>
            <ModalBody>
            {customerDetail? <Form>
                    <FormGroup row>
                        <Label for="name" sm={2}>Name</Label>
                        <Col sm={10}>
                        <Input type="text" name="name" id="name" placeholder="vani" value={customerDetail.name} onChange={(data)=>{this.onChange(data)}} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="exampleEmail" sm={2}>Email</Label>
                        <Col sm={10}>
                        <Input type="email" name="email" id="exampleEmail" placeholder="test@gmail.com" value={customerDetail.email} onChange={(data)=>{this.onChange(data)}} />
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="examplePassword" sm={2}>Password</Label>
                        <Col sm={10}>
                        <Input type="password" name="password" id="examplePassword" placeholder="test123" value={customerDetail.password} onChange={(data)=>{this.onChange(data)}} />
                        </Col>
                    </FormGroup>
                     <FormGroup row>
                        <Label for="gender" sm={2}>Gender</Label>
                        <Col sm={10}>
                        <Input type="select" name="gender" id="gender" value={customerDetail.gender} onChange={(data)=>{this.onChange(data)}}>
                            <option>Male</option>
                            <option>Female</option>
                        </Input>
                        </Col>
                    </FormGroup>
                   <FormGroup row>
                        <Label for="status" sm={2}>Status</Label>
                        <Col sm={10}>
                        <Input type="select" name="is_married" id="status" value={customerDetail.is_married} onChange={(data)=>{this.onChange(data)}}>
                            <option value={1}>Married</option>
                            <option value={0}>Single</option>
                        </Input>
                        </Col>
                    </FormGroup>
                     <FormGroup>
                        <Label for="address">Address</Label>
                        <Input type="textarea" name="address" id="address" value={customerDetail.address} onChange={(data)=>{this.onChange(data)}} />
                    </FormGroup>
                </Form>:<div> please wait ...</div>}

            </ModalBody>
            <ModalFooter>
            {isNew && customerDetail.length > 0?<Button color="primary" onClick={this.createCustomerData}>Create</Button>:
            <Button color="primary" onClick={()=>this.updateCustomerData(customerDetail)}>Update</Button>}{' '}
            <Button color="secondary" onClick={this.toggleCondition}>Cancel</Button>
            </ModalFooter>
        </Modal>
         <Alert style={styleCss.alert} color="info" isOpen={alert} >
            {message}
        </Alert>
      </Container>

    );
  }
}

export default Customer;