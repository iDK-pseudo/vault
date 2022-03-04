import React, { useReducer, useState } from "react";
import Drawer from "@mui/material/Drawer";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import EventIcon from "@mui/icons-material/Event";
import LockIcon from "@mui/icons-material/Lock";
import AddCardIcon from "@mui/icons-material/AddCard";
import APIUtils from "../../api/APIUtils.js";
import LoadingButton from "@mui/lab/LoadingButton";

function reducer(state, { name, event, showError }) {
    let isValid = false;

    if (showError)
        return { ...state, [name]: { value: state[name].value, error: true } };

    switch (name) {
        case "cardnum":
            let newCardNum = null;
            if (
                event.nativeEvent.inputType.includes("insert") &&
                clearCardNum(event.target.value).length <= 16
            ) {
                newCardNum = formatCardNum(event.target.value, "add");
                isValid = true;
            } else if (
                event.nativeEvent.inputType.includes("delete") &&
                clearCardNum(event.target.value).length >= 0
            ) {
                newCardNum = formatCardNum(event.target.value, "del");
                isValid = true;
            }
            if (isValid) {
                return {
                    ...state,
                    [name]: { value: newCardNum, error: false },
                };
            }
            break;
        case "month":
            isValid =
                (event.nativeEvent.inputType.includes("insert") &&
                    state.month.value.length < 2) ||
                (event.nativeEvent.inputType.includes("delete") &&
                    state.month.value.length > 0);
            break;
        case "year":
            isValid =
                (event.nativeEvent.inputType.includes("insert") &&
                    state.year.value.length < 4) ||
                (event.nativeEvent.inputType.includes("delete") &&
                    state.year.value.length > 0);
            break;
        case "cvv":
            isValid =
                (event.nativeEvent.inputType.includes("insert") &&
                    state.cvv.value.length < 3) ||
                (event.nativeEvent.inputType.includes("delete") &&
                    state.cvv.value.length > 0);
            break;
        case "reset":
            return { ...initialState };
        default:
            return state;
    }
    if (isValid)
        return {
            ...state,
            [name]: { value: event.target.value, error: false },
        };
    else return state;
}

const formatCardNum = (cardNum, action) => {
    const cleared = clearCardNum(cardNum);
    switch (action) {
        case "add":
            if (cleared.length != 16 && cleared.length % 4 === 0) {
                cardNum += "  ";
            }
            break;
        case "del":
            if (cleared.length != 0 && cleared.length % 4 === 0) {
                cardNum = cardNum.substring(0, cardNum.length - 2);
            }
            break;
    }
    return cardNum;
};

const clearCardNum = (cardNum) => {
    return cardNum.replaceAll(/\s/g, "");
};

const initialState = {
    cardnum: {
        value: "",
        error: false,
    },
    month: {
        value: "",
        error: false,
    },
    year: {
        value: "",
        error: false,
    },
    cvv: {
        value: "",
        error: false,
    },
};

export default function AddCardDrawer(props) {
    const [loading, setLoading] = useState(false);
    const [{ cardnum, month, year, cvv }, dispatch] = useReducer(reducer, {
        ...initialState,
    });

    const handleAddNewCard = async () => {
        setLoading(true);
        const response = await APIUtils.addNewCard(
            clearCardNum(cardnum.value),
            month.value,
            year.value,
            cvv.value
        );
        let errorSet = new Set();
        if (!response.success) {
            response.errors.forEach((e) =>
                !e.valid ? errorSet.add(e.param) : null
            );
            errorSet.forEach((e) =>
                dispatch({ name: e, showError: true, event: null })
            );
        } else if (response.success) {
            setLoading(false);
            dispatch({ name: "reset", showError: false, event: null });
            props.handleAddNewCardSuccess();
        }
        setLoading(false);
    };

    return (
        <Drawer
            open={props.open}
            anchor="bottom"
            PaperProps={{
                sx: { padding: 5 },
            }}
            onClose={() => {
                dispatch({ name: "reset", showError: false, event: null });
                props.handleDrawerClose();
            }}
        >
            <InputLabel>Card Number</InputLabel>
            <Input
                name="cardnum"
                type="tel"
                value={cardnum.value}
                onChange={(e) => dispatch({ name: "cardnum", event: e })}
                error={cardnum.error}
                startAdornment={
                    <InputAdornment position="start">
                        <CreditCardIcon fontSize="small" />
                    </InputAdornment>
                }
                placeholder="1234  2232  1232  1223"
                sx={{
                    fontSize: "30px",
                    fontWeight: "bolder",
                    fontFamily: "SourceSansPro",
                }}
            />
            <div style={{ display: "flex", marginTop: "30px" }}>
                <div>
                    <InputLabel>Month</InputLabel>
                    <Input
                        name="month"
                        type="number"
                        value={month.value}
                        onChange={(e) => dispatch({ name: "month", event: e })}
                        error={month.error}
                        startAdornment={
                            <InputAdornment position="start">
                                <EventIcon fontSize="small" />
                            </InputAdornment>
                        }
                        placeholder="01"
                        sx={{
                            fontSize: "25px",
                            marginRight: "20px",
                            fontWeight: "bolder",
                        }}
                    />
                </div>
                <div>
                    <InputLabel>Year</InputLabel>
                    <Input
                        name="year"
                        type="number"
                        value={year.value}
                        onChange={(e) => dispatch({ name: "year", event: e })}
                        error={year.error}
                        startAdornment={
                            <InputAdornment position="start">
                                <EventIcon fontSize="small" />
                            </InputAdornment>
                        }
                        placeholder="2020"
                        sx={{
                            fontSize: "25px",
                            marginRight: "20px",
                            fontWeight: "bolder",
                        }}
                    />
                </div>
                <div>
                    <InputLabel>CVV</InputLabel>
                    <Input
                        name="cvv"
                        type="number"
                        value={cvv.value}
                        onChange={(e) => dispatch({ name: "cvv", event: e })}
                        error={cvv.error}
                        startAdornment={
                            <InputAdornment position="start">
                                <LockIcon fontSize="small" />
                            </InputAdornment>
                        }
                        placeholder="123"
                        sx={{
                            fontSize: "25px",
                            fontWeight: "bolder",
                        }}
                    />
                </div>
            </div>
            <p
                style={{
                    display: "flex",
                    marginTop: 20,
                    fontSize: 15,
                    justifyContent: "center",
                    fontFamily: "SourceSansPro",
                    color: "#98a7bb",
                }}
            >
                <LockIcon style={{ marginRight: 5, fontSize: 15 }} /> 256 bit
                encryption
            </p>
            <LoadingButton
                loading={loading}
                variant="contained"
                size="large"
                sx={{
                    "&.MuiButton-root:hover": {
                        background: "#F2A313",
                    },
                    marginTop: "30px",
                    color: "white",
                    background: "#F2A313",
                }}
                startIcon={<AddCardIcon />}
                onClick={handleAddNewCard}
            >
                Add
            </LoadingButton>
        </Drawer>
    );
}
