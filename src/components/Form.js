import '../styles/Form.css'

function Form () {
    return (
        <form class="card-details-form">
            <label> First Name </label>
            <input type="text"/>
            <label> Last Name </label>
            <input type="text"/>
            <label> Bank </label>
            <input type="text"/>
            <label> Card Number </label>
            <input type="number"/>
            <label> Expires </label>
            <input type="month"/>
            <label> CVV </label>
            <input type="text"/>
            <button> + </button>
        </form>
    )
}

export default Form;