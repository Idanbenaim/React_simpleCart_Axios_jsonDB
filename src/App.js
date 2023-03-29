import './App.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {
  const [products, setproducts] = useState([])
  const [desc, setdesc] = useState("")
  const [price, setprice] = useState(0)
  const [refreshFlag, setrefreshFlag] = useState(true)
  const MY_SERVER = 'http://localhost:5000/products'

  const getData = async () => {
    axios.get(MY_SERVER).then(res => setproducts(res.data))
    console.log(products);
  }

  const delItem = (id) => {
    axios.delete(`${MY_SERVER}/${id}`)
    // setproducts(products.filter(item => item.id != id))
    setrefreshFlag(!refreshFlag)
  }

  const AddProduct = () => {
    axios.post(MY_SERVER, { desc, price })
    setrefreshFlag(!refreshFlag)
  }
  const updItem = async (prod) => {
    let res = await axios.put(`${MY_SERVER}/${prod.id}`, { desc, price })
    setrefreshFlag(!refreshFlag)
  }
  useEffect(() => {
    getData()
  }, [refreshFlag])

  useEffect(() => {
    let temp = JSON.parse(localStorage.getItem('cart'))
    console.log(temp)
    if (temp) {
      if (temp.length > 0)
        setCart(temp)
    }
  }, [])



  //////////////////////////////////////////
  // ////////////////cart Start //////////
  const [cart, setCart] = useState([])
  
  const add2Cart = async (prod) => {
    prod.quantity = 1; // initialize the quantity to 1
    let res = await setCart([...cart, prod]);
    localStorage.setItem('cart', JSON.stringify([...cart, prod]));
  }
  

  const removeFromCart = async (prod) => {
    const updatedCart = cart.filter(item => item.id !== prod.id);
    let res = await setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }

  const updateCartItemQuantity = async (prod, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item.id === prod.id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    let res = await setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  }


  // //////////////////////////cart END
  //////////////////////////////////////////
  return (
    <div className="App">
      <header className="App-header">
        Desc<input onChange={(e) => setdesc(e.target.value)} />
        Price<input onChange={(e) => setprice(+e.target.value)} />
        Desc:{desc} &nbsp;
        price:{price}
        <button onClick={() => AddProduct()}>add</button>
        <hr></hr>
        we have a total of {products.length} items
        {products.map((prod) => <div key={prod.id}> Desc: {prod.desc},  Price: {prod.price}
          <button onClick={() => delItem(prod.id)}>Del - {prod.id}</button>
          <button onClick={() => updItem(prod)}>Upd - {prod.id}</button>
          <button onClick={() => add2Cart(prod)}>Buy- {prod.id}</button>
        </div>)}
        <hr>
        </hr>
        My Cart
        {cart.map((prod) => (
          <div key={prod.id}>
            Desc: {prod.desc}, Price: {prod.price}
            <button onClick={() => removeFromCart(prod)}>remove</button>
            <button onClick={() => updateCartItemQuantity(prod, prod.quantity - 1)}>-</button>
            <span>{String(prod.quantity)}</span>
            <button onClick={() => updateCartItemQuantity(prod, prod.quantity + 1)}>+</button>
          </div>
        ))}


        {/* {cart.map((prod) => <div key={prod.id}> Desc: {prod.desc},  Price: {prod.price}
          <button onClick={() => removeFromCart(prod)}>remove - {prod.id}</button>
        </div>)}
        {cart.map(item => (
          <div key={item.id}>
            <span>{item.name} - {item.price}$</span>
            <button onClick={() => updateCartItemQuantity(item, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateCartItemQuantity(item, item.quantity + 1)}>+</button>
          </div>
        ))} */}
      </header>
    </div>
  );
}

export default App;


// {
//   "products": [
//     {
//       "id": 1,
//       "desc": "pasta",
//       "price": 12
//     },
//     {
//         "id": 2,
//         "desc": "krembo",
//         "price": 2
//       }, {
//         "id": 3,
//         "desc": "jahnoon",
//         "price": 10
//       }
//   ]
// }
// React_simpleCart_Axios_jsonDB