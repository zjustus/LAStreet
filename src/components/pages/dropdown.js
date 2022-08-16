import React from "react";
import { default as ReactSelect } from "react-select";
import Select, {components} from "react-select";
import MySelect from "./dropdownhelper";
import * as d3 from 'd3';

  //dropdown menus
  const myOptions = [
      { value: 'advantage', label: 'Non disadvantage Community' },
      { value: 'nondisadvantage', label: 'Disadvantage Community' },
      { value: 'lowincome', label: 'Low Income' }
    ];



//checkbox
  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{" "}
          <label>{props.label}</label>
        </components.Option>
      </div>
    );
  };

  const allOption = {
    label: "Select all",
    value: "*"
  };

  const ValueContainer = ({ children, ...props }) => {
    const currentValues = props.getValue();
    let toBeRendered = children;
    if (currentValues.some(val => val.value === allOption.value)) {
      toBeRendered = [[children[0][0]], children[1]];
    }
  
    return (
      <components.ValueContainer {...props}>
        {toBeRendered}
      </components.ValueContainer>
    );
  };

  const MultiValue = props => {
    let labelToBeDisplayed = `${props.data.label} `;
    if (props.data.value === allOption.value) {
      labelToBeDisplayed = "All is selected";
    }
    return (
      <components.MultiValue {...props}>
        <span>{labelToBeDisplayed}</span>
      </components.MultiValue>
    );
  };

  class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          optionSelected: null
        };
    }

    handleChange = (selected) => {
        this.setState({
          optionSelected: selected
        });
    };

    render(){
      d3.select('#container').select('[id="test"]').remove();
      d3.select('#container').append('text').attr('id', 'test').text('please!');

      return (
        <span
        class="d-inline-block"
        data-toggle="popover"
        data-trigger="focus"
        data-content="Please selecet account(s)"
        >
        <MySelect 
            options = {myOptions}
            isMulti 
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            components={{
              Option,
              MultiValue,
              ValueContainer
            }}
            onChange={this.handleChange}
            allowSelectAll={true}
            value={this.state.optionSelected}                      
        />
        </span>
      );
    }
  }

  function printDropDown() {
    return 3;
  }

export {Dropdown, printDropDown};