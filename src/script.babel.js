const maxNum = 19;
class Calculator extends React.Component{
  
  constructor(props){
    super(props);
    this.state = {
      currentVal: "0",
      prevVal: "0",
      formula: "",
      evaluated: false
    };
    this.handleNumbers = this.handleNumbers.bind(this);
    this.handleOperators = this.handleOperators.bind(this);
    this.handleEvaluate = this.handleEvaluate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.initialize = this.initialize.bind(this);    
  }
  
  maxDigitWarning(){
    this.setState({
      currentVal: "Digit Limit Met",
      prevVal: this.state.currentVal
    });
    
    setTimeout(() => this.setState({
      currentVal: this.state.prevVal
    }),1000)
  }
  
  handleNumbers(event) {
    const input = event.target.value;
    const doubleDecimal = this.state.currentVal.includes('.') && input === "."
    // executed code below only if 19 digit value limit not crossed
    if (!this.state.currentVal.includes('Limit') && !doubleDecimal) {
      // get state value
      const {currentVal, formula, evaluated} = this.state;
      // declare not evaluating state
      this.setState({evaluated: false})
      // if previous command is "="
      if(evaluated){
        this.setState(prevState => ({
          currentVal: "0",
          formula: ""
        }))
      }
      // function to setCurrentVal
      const setCurrentVal = (prevState,input)=> {
        const {currentVal, formula} = prevState;
        if(formula.length <= maxNum * 2){
          // not include 0 or operator with inputed value
          const isPrevValOperator = /[x÷+\-%]/.test(currentVal);
          const isPrevValZero = currentVal == "0";
          if(isPrevValOperator || isPrevValZero){
            return input;
          }
          // otherwise include currentVal with inputed value
          return currentVal + input;
        }
        return currentVal; // not include input because formula space limit crossed
      };
      // function to setFormula
      const setFormula = (prevState, input) => {
        const {formula, prevVal} = prevState;
        if(formula.length <= maxNum * 2){
          return formula + input;
        }
        return formula; // not include input because formula space limit crossed
      }
      // change state
      if(currentVal.length <= maxNum){
        this.setState(prevState => ({
          currentVal:  setCurrentVal(prevState,input),
          formula: setFormula(prevState, input) 
        }))
      }else{
        this.maxDigitWarning()
      }
    }
  }
  
  handleOperators(event) {
    const input = event.target.value;
    const doubleMinus = this.state.currentVal.includes('-') && input === "-"
    // executed code below only if 19 digit value limit not crossed
    if (!this.state.currentVal.includes('Limit') && !doubleMinus) {
      // declare not evaluating state
      this.setState({evaluated: false})
      // get state value
      const {currentVal, evaluated} = this.state;
       // function to setFormula
      const setFormula = (prevState, input) => {
        const {formula, prevVal} = prevState;
        const isEndsOperator = /[x÷+\-%]$/.test(formula);
        
        if(evaluated){
          return prevVal + input;
        };
        if(input==="-"){
          return formula + input;
        };
        if(isEndsOperator){
          return prevVal + input;
        };
        //on other case
        this.setState({prevVal: formula})
        return formula + input;
      };

      // change state
      if(currentVal.length <= maxNum){
        this.setState(prevState => ({
          currentVal: input,
          formula: setFormula(prevState, input)
        }))
      }else{
        this.maxDigitWarning()
      }
    }
  }
  
  handleEvaluate(){
    // executed code below only if 19 digit value limit not crossed
    if (!this.state.currentVal.includes('Limit')) {
      let expresion = this.state.formula;
      
      const isEndsOperator = /[x÷+\-%]$/.test(expresion);
      if(isEndsOperator){
        expresion = expresion.slice(0, -1) // exclude end operator
      }
      
      expresion = expresion.replace(/x/gi,"*")
                           .replace(/÷/gi,"/")

      const answer = eval(expresion)
      // function to setFormula
      const setFormula = (prevState, answer) => {
        const {formula} = prevState;
        const expresion = formula + "=" + answer;
        if(expresion.length <= maxNum * 2){
          return expresion;
        }
        return formula; // not include answer beacause space short
      }
      
      if(answer.toString().length <= maxNum){
        this.setState(prevState => ({
            currentVal: answer.toString(),
            formula: setFormula(prevState, answer),
            prevVal: answer,
            evaluated: true
         }))
      }else{
        this.maxDigitWarning()
      }
    }
  }
  
  handleDelete(){
   if(this.state.currentVal.length >= 1 && !this.state.evaluated){
     this.setState(prevState => ({
       currentVal: prevState.currentVal.slice(0, -1),
       formula: prevState.formula.slice(0, -1)
     }))
   }
  }
  
  initialize(){
    this.setState ({
      currentVal: "0",
      prevVal: "0",
      formula: "",
      evaluated: false
    });
  }
  
  render(){
    
    const {currentVal, formula} = this.state;
    
    return (
      <div className="calculator">
        
        <div className="calculator-screen">
          <div className="formulaScreen">{formula}</div>
          <div className="outputScreen" id="display">{currentVal}</div>
        </div>
        
        <Buttons 
          numberHandler = {this.handleNumbers}
          operatorHandler = {this.handleOperators}
          evaluator = {this.handleEvaluate}
          initializer = {this.initialize}
          deleteOneByOne = {this.handleDelete}          
        /> 
        
      </div>
    )
  }
}


class Buttons extends React.Component{
  
  zeroStyle = {gridColumn: "1 / span 2"}
  
  buttonsInfo(props) {
    
      const {numberHandler, operatorHandler, deleteOneByOne, evaluator, initializer} = props;
    
      return [{id: "zero", value:"0", onClick: numberHandler, style:this.zeroStyle, order: 15},
              {id: "one", value:"1", onClick: numberHandler, order: 11},
              {id: "two", value:"2", onClick: numberHandler, order: 12},
              {id: "three", value:"3", onClick: numberHandler, order: 13},
              {id: "four", value:"4", onClick: numberHandler, order: 7},
              {id: "five", value:"5", onClick: numberHandler, order: 8},
              {id: "six", value:"6", onClick: numberHandler, order: 9},
              {id: "seven", value:"7", onClick: numberHandler, order: 3},
              {id: "eight", value:"8", onClick: numberHandler, order: 4},
              {id: "nine", value:"9", onClick: numberHandler, order: 5},
              {id: "decimal", value:".", onClick: numberHandler, order: 16},

              {id: "add", value:"+", onClick: operatorHandler, className: "operator", order: 14},
              {id: "subtract", value:"-", onClick: operatorHandler, className: "operator", order: 10},
              {id: "multiply", value:"x", onClick: operatorHandler, className: "operator", order: 6},
              {id: "divide", value:"÷", onClick: operatorHandler,  className: "operator", order: 2},
              
              {id: "module", value:"⌫", onClick: deleteOneByOne, className: "operator", order: 1},

              {id: "equals", value:"=", onClick: evaluator, className: "operator", order: 17},

              {id: "clear", value:"AC", onClick: initializer, className: "operator all-clear", order: 0},
             ].sort((a,b) => a.order - b.order)
      }
  
  render() {
    const buttonsInfo = this.buttonsInfo(this.props);
    return (
      <div className="calculator-keys">
        {buttonsInfo.map((btnAttr, idx) =>    
          <button key={idx} {...btnAttr}>
            {btnAttr.value === "⌫" ? <i className="fas fa-backspace"></i> : btnAttr.value}
          </button>
        )}
      </div>
    )
  }
}


ReactDOM.render(<Calculator />, document.getElementById("app"));