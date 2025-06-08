/**
 * @Author MG SHABALALA
 * @Date 18/07/2024
 * @class LoveCalculator
 * @description This class is built by taking in UI-references(IDs) for UI updates in the constructor,
 *  main inputs are two strings representing the names of the players,
 *  it takes inputs through form submition event, it validates, format, perform class operations on them and update the UI
 */
class Calculator{
    //classe's variables
    _name_joiner = 'loves';

    // constant variables
    END_GAME_MODAL_ID = 'end-game-modal';
    COUNTER_LIST_UL = 'counter-list-UL';
    COUNTER_LIST_LI = 'counter-list-li';
    MINIMUM_NAME_LENGTH = 3;
    MAXIMUM_NAME_LENGTH = 60;
    MINIMUM_CHARACTER_ERROR_MESSAGE = `A player name must be atleast ${this.MINIMUM_NAME_LENGTH} characters long`;
    MAXIMUM_CHARACTER_ERROR_MESSAGE = `A player name must not be greater than ${this.MAXIMUM_NAME_LENGTH} characters long`;
    constructor(
        bodyID, 
        calculatorFormID,
        firstNameErrorMessageParagraphID,
        secondNameErrorMessageParagraphID,
        twoCombinedNamesParagraphID,
        calculatorDisplayListHolderID )
    {
        this.getPlayerNames(
            bodyID,
            calculatorFormID,
            firstNameErrorMessageParagraphID,
            secondNameErrorMessageParagraphID,
            twoCombinedNamesParagraphID, 
            calculatorDisplayListHolderID);
    }

    // accessors
    /**
     * returns a string values used to join two names from user input
     */
    get nameJoiner(){ return this._name_joiner; }

    // mutators
    /**
     * sets a string value used to join two names from user input
     */
    set nameJoiner(nameJoiner) { this._name_joiner = nameJoiner; }

    /**
     * get player names from user interface's form submition
     * @param {string} calculatorFormID form used to get Player names
     * @param {string} firstNameErrorMessageParagraphID error message holder paragraph selector id for first input
     * @param {string} secondNameErrorMessageParagraphID error message holder paragraph selector id for second input
     * @param {string} twoCombinedNamesParagraphID  message holder paragraph id for combined user inputs (names)
     * @param {string} calculatorDisplayListHolderID list holder ul id for appending other lists
     */
    getPlayerNames(
        bodyID,
        calculatorFormID, 
        firstNameErrorMessageParagraphID, 
        secondNameErrorMessageParagraphID, 
        twoCombinedNamesParagraphID,
        calculatorDisplayListHolderID){
        try{
            //select the form from UI
            const calculatorForm = this.selectFormFromUI(calculatorFormID);
            //if the form specified is valid get form inputs
            calculatorForm.addEventListener('submit', submitionEvent => {
                submitionEvent.preventDefault(); //prevent form submition's default behavior
                //catch errors during form submission
                try{
                    const formData = new FormData(calculatorForm);  //get form input details
                    //validate first name and second name and associate them with their IDs
                    // this.getFormData(calculatorForm, 'firstPlayerName', 'secondPlayerName');
                    const firstPlayerName =  this.validateAndFormatInput(formData.get('firstPlayerName'), firstNameErrorMessageParagraphID);
                    const secondPlayerName = this.validateAndFormatInput(formData.get('secondPlayerName'), secondNameErrorMessageParagraphID);
                    //return the above two names joined with 'NAME_JOINER' classe's constant variable
                    const combinedNames = this.combineNamesWithNameJoiner(firstPlayerName, secondPlayerName, this.nameJoiner);
                    //update UI with player names
                    this.displayPlayerNamesUIUpdate(firstPlayerName, secondPlayerName, twoCombinedNamesParagraphID);
                    //store a list of character-count objects
                    const characterCountPairList = this.countEachCharacterFromJoinedString(combinedNames);
                    //extract counts and store in count list
                    const countValuesList = this.extractCount(characterCountPairList);
                    //perform summation recursively
                    this.performSummationRecursively(countValuesList, calculatorDisplayListHolderID, firstPlayerName, secondPlayerName, bodyID);
                    // this.initializeGame(formData, calculatorDisplayListHolderID);
                }catch(err){
                    //identify where the error occured by error id for each input
                    if(err.message.includes(firstNameErrorMessageParagraphID)){
                        this.inputErrorUIUpdate(err, firstNameErrorMessageParagraphID);
                    }else if(err.message.includes(secondNameErrorMessageParagraphID)){
                        this.inputErrorUIUpdate(err, secondNameErrorMessageParagraphID);
                    }else console.error(err);
                }
            })
		// catch invalid form error
        }catch(err){
			// log invalid form error into the console
            console.error(err);
        }
    }

    /**
     * linear recursion to sumFirstAndLastCountValues function with a base case of countlist length minus one
     * @param {array} countList list to be parsed to summation fiunction
     * @param {string} calculatorDisplayListHolderID select lust hold ul through its ID and append new list every time recursion occurs
     * @returns newList of length of the countList is 0, else repeat the process until is equal to 0
     */
    performSummationRecursively(countList, calculatorDisplayListHolderID, firstPlayerName, secondPlayerName, bodyID){
        let newList = this.sumFirstAndLastCountValues(countList, calculatorDisplayListHolderID);
        //base case
        if(newList.length == 2){
            this.countElementsUIUpdate(newList, calculatorDisplayListHolderID);
            //update UI for end of game status
            this.endGameResultsUIUpdate(newList, bodyID,firstPlayerName, secondPlayerName )
        }else if(newList.length > 2){
            const TIMEOUT = 2000;
            setTimeout(() => {
                this.performSummationRecursively(newList, calculatorDisplayListHolderID, firstPlayerName, secondPlayerName, bodyID);
            }, TIMEOUT);
           
        }
    }

    /**
     * takes a list of numbers(count) and add last and first values and return a new list
     * @param {array} list list of count values
     * @param {string} calculatorDisplayListHolderID select lust hold ul through its ID and append new list
     * @returns new list of last+first values from count
     */
    sumFirstAndLastCountValues(list, calculatorDisplayListHolderID){
        // update UI with the available list
        this.countElementsUIUpdate(list, calculatorDisplayListHolderID);
        let summedValuePairsList =  [];
        let listLength = list.length;
        
        //iterate the list from beginning through halfway
        for(let currentIndex = 0; currentIndex < list.length / 2; currentIndex++){
            //extract two elements to be added together
            const firstElement = list[currentIndex];  // first/current element
            const secondElement = list[listLength - 1];  //second/last element
            //check if list is odd and extract the last element from the middle of the list
            if(this.isListOdd(currentIndex, listLength)){summedValuePairsList.push(list[currentIndex]);}
            else {
                const countSum = firstElement + secondElement;
                //check if summed values exceeds 9
                if(this.isGreaterThanNine(countSum)){
                     summedValuePairsList = this.extendListWithValuesGreaterThanNine(countSum, summedValuePairsList);
                    // if(summedValuePairsList.length === 2) return;
                }else {
                    //if summed values is less than 10 push it into the list
                    summedValuePairsList.push(countSum);
                }
            }

            if(listLength == 1) summedValuePairsList.push(list[currentIndex]);
            this.deallocateMemory(list, listLength, currentIndex);
            listLength--;  //shrinks the iteration, which avoid counting empty'ed indexes
        }
        return summedValuePairsList;
    }

    /**
     * takes the countSum greater than 9, split it, concatenate it with summedValuePairsList and return new array
     * @param {number} countSum a value greater than 9, is to be split into its single digits
     * @param {array} summedValuePairsList list to be joined with split sum
     * @returns new concatenated list (concatenate summedValuePairsList with countSum)
     */
    extendListWithValuesGreaterThanNine(countSum, summedValuePairsList){
        let extendedList = [];
        let extentionList = this.splitElementsGreaterThanNine(new String(countSum));
        extendedList = this.concatenateTwoLists(summedValuePairsList, extentionList);
        return extendedList;
    }

     /**
     * Update UI with every list generated by appending list into the listHolder UI element
     * @param {array} list  - list to append to the UI
     * @param {string} calculatorDisplayListHolderID - ID to reference list holder UI element
     */
     countElementsUIUpdate(list, calculatorDisplayListHolderID){
        const currentUIList = this.createCountUIList(list);
        const countValuesListHolder = this.selectULForCountListsFromUI(calculatorDisplayListHolderID);
        countValuesListHolder.append(currentUIList);
    }


    /**
     * 
     * @param {Array} list1 
     * @param {Array} list2 
     * @returns array
     */
    concatenateTwoLists(list1, list2){
        return list1.concat(list2);
    }

    splitElementsGreaterThanNine(list){
        let newList = [];
        for(let i = 0; i < list.length; i++){
            newList.push(parseInt(list[i]));  //parse values as integers to allow integer operations
        }
        return newList;
    }

    /**
     * check if list is odd
     * @param {number} currentIndex used to perform boolean operation for checking if list is odd
     * @param {number} listLength used to perform boolean operation for checking if list is odd
     * @returns true or false
     */
    isListOdd(currentIndex, listLength){
        return (currentIndex == listLength - 1);
    }

    // deepCopy(list){
    //     let copy = [];
    //     for(let i = 0; i < list.length; i++){
    //         copy.push(list[i]);
    //     }
    //     return copy;
    // }

    /**
     * delete last and current/corresponding index from the list
     * @param {array} list list to delete elements from
     * @param {number} listLength list length for deleting element from its previous position
     * @param {number} currentIndex for deleting current index
     */
    deallocateMemory(list, listLength, currentIndex){
        delete list[currentIndex];
        delete list[listLength - 1];
    }

   
    /**
     * take array list as input and create list elements for each and an ul to store them
     * @param {array} countList array containing count values
     * @returns html ul element populated with list elements containing list values
     */
    createCountUIList(countList){
        let countValueUL = document.createElement('ul');
        countValueUL.setAttribute('class', this.COUNTER_LIST_UL);
        for(let index = 0; index < countList.length; index++){
            const countLI = document.createElement('li');
            countLI.setAttribute('class', this.COUNTER_LIST_LI);
            countLI.textContent = countList[index];
            countValueUL.append(countLI);
        }
        return countValueUL;
    }

    /**
     * update UI based on error message
     * @param {object} error error thrown by input validation failure
     * @param {string} inputID ID to reference an paragraph element where the error occured
     */
    inputErrorUIUpdate(error, inputID){
        const errorMessage = document.getElementById(inputID);
        errorMessage.textContent = error.message.replace(inputID, 'Player');
        const TIMEOUT = 3000;
        // clear error message after TIMEOUT
        setTimeout(() => {
            errorMessage.textContent = ''
        }, TIMEOUT);
    }

    /**
     * join firstPlayerName and SecondPlayerName with name joiner string
     * @param {string} firstPlayerName firstPlayerName identified by form input's name property
     * @param {string} secondPlayerName secondPlayerName identified by form input's name property
     * @param {string} nameJoiner name joiner class variable
     * @returns firstPlayerName and secondPlayerName joined by nameJoiner string
     */
    combineNamesWithNameJoiner(firstPlayerName, secondPlayerName, nameJoiner){
        const playerNamesList = [firstPlayerName, secondPlayerName];
        return playerNamesList.join(nameJoiner);
    }

    /**
     * update ui with player names joined by name joiner
     * @param {string} firstPlayerName firstPlayerName identified by form input's name property
     * @param {string} secondPlayerName secondPlayerName identified by form input's name property
     * @param {string} twoCombinedNamesParagraphID id for selecting paragraph tag to add textContent
     */
    displayPlayerNamesUIUpdate(firstPlayerName, secondPlayerName, twoCombinedNamesParagraphID){
        const combinedNamesUISelector = this.selectParagraphForNamesFromUI(twoCombinedNamesParagraphID);
        combinedNamesUISelector.textContent = `${firstPlayerName.toUpperCase()} ${this.nameJoiner} ${secondPlayerName.toUpperCase()}`;
    }


    /**
     * 
     * @param {array} list consist of percentages at the end of the game
     * @param {string} bodyID id to reference body html element
     * @param {string} firstPersonName firstPlayerName identified by form input's name property
     * @param {*} secondPersonName secondPlayerName identified by form input's name property
     */
    endGameResultsUIUpdate(list, bodyID, firstPersonName, secondPersonName){
        const body = this.selectBodyFromUI(bodyID);
        body.append(this.createEndGameModal(list, firstPersonName, secondPersonName));
    }

    initializeGame(){

    }


    /**
     * 
     * @param {array} list list elements as percentages
     * @param {string} firstPersonName user first input
     * @param {string} secondPersonName user second input
     * @returns html element div
     */
    createEndGameModal(list, firstPersonName, secondPersonName){
        const names = document.createElement('p');
        names.textContent = `${firstPersonName} ${this._name_joiner} ${secondPersonName}`.toUpperCase();
        const percentage = document.createElement('h3');
        percentage.textContent = `${list[0]} ${list[1]} % `;
        const innerDiv = document.createElement('div');
        innerDiv.append(names, percentage);
        const div = document.createElement('div');
        div.setAttribute('id', this.END_GAME_MODAL_ID);
        div.append(innerDiv);
        return div;
    }

    /**
     * extract only count values from character-count objects list
     * @param {array} characterCountPairList chracter-count object list
     * @returns count list 
     */
    extractCount(characterCountPairList){
        let countList = [];
        for(let index = 0; index < characterCountPairList.length; index++){
            countList.push(characterCountPairList[index].count);
        }
        return countList;
    }

    /**
     * check if value is a single digit or not
     * @param {number} number number to be evaluated
     * @returns true or false
     */
    isGreaterThanNine(number){
        return (parseInt(number) >= 10);
    }

    /**
     * count each character from inputed string and return a list of objects representing each character
     * @param {string} combinedNamesString two strings(names) combined with name joiner string
     * @returns list with objects representing how many alphabets of each character exist in the string
     */
    countEachCharacterFromJoinedString(combinedNamesString){
        //convert string to wrapperType (array);
        const combinedNamesArray = new String(combinedNamesString);
        let characterCountList = [];
        //iterate through each character
        for(let index = 0; index < combinedNamesArray.length; index++){
            const currentCharacter = combinedNamesArray[index];
            const currentCharacterCountExpression = new RegExp(currentCharacter, 'gmi');
            const characterCount = combinedNamesArray.match(currentCharacterCountExpression).length;
            const characterCountObj = {character : currentCharacter, count : characterCount }
            //check if the character already exist in the characterCountList and if not add it to the list
            if(!this.hasElement(characterCountObj, characterCountList)){
                characterCountList.push(characterCountObj)
            }
        }
        return characterCountList;
    }

    //ui selectors
    /**
     * select paragraph from ui using twoCombinedNamesParagraphID as its ID
     * @param {string} twoCombinedNamesParagraphID id for selecting paragraph tag to add textContent
     * @returns html paragraph tag
     */
    selectParagraphForNamesFromUI(twoCombinedNamesParagraphID){
        const paragraph = document.getElementById(twoCombinedNamesParagraphID);
        //check if the form is valid
        if(!this.isHTMLElementValid(paragraph, 'p')) throw new Error('Paragraph specified does not exist in the UI');
        return paragraph;
    }

    /**
     * select form from ui using formID as its ID
     * @param {string} formID id for selecting calculator form
     * @returns html form tag
     */
    selectFormFromUI(formID){
        const form = document.getElementById(formID);
        //check if the form is valid
        if(!this.isHTMLElementValid(form, 'form')) throw new Error('Form specified does not exist in the UI');
        return form;
    }

    /**
     * select list (for appending other lists) using calculatorDisplayListHolderID as its id
     * @param {string} calculatorDisplayListHolderID ID to reference list holder UI element
     * @returns html ul element
     */
    selectULForCountListsFromUI(calculatorDisplayListHolderID){
        const ul = document.getElementById(calculatorDisplayListHolderID);
        //check if the form is valid
        if(!this.isHTMLElementValid(ul, 'ul')) throw new Error('Unordered list specified does not exist in the UI');
        return ul;
    }

    /**
     * select body using bodyID as its id
     * @param {string} bodyID ID to reference list body element
     * @returns html body element
     */
    selectBodyFromUI(bodyID){
        const body = document.getElementById(bodyID);
        //check if body is valid
        if(!this.isHTMLElementValid(body, 'body')) throw new Error('Body tag specified does not exist in the UI')
        return body;
    }

    // validators

    /**
     * checks if the element selected exists in the ui and checks if its type matches the one specified by elementType
     * @param {htmlElement} htmlElement element to be validated
     * @param {string} elementType type of element to match
     * @returns true or false
     */
    isHTMLElementValid(htmlElement, elementType) {
        return (htmlElement !== null) && 
               (htmlElement.nodeName.toLowerCase() === elementType );
    }

    /**
     * checks if input value playerName is valid based on minimum and maximum character length
     * @param {string} playerName user input UI
     * @returns true or false
     */
    isPlayerNameValid(playerName){
        return ((playerName.length < this.MINIMUM_NAME_LENGTH)  ||
                (playerName.length > this.MAXIMUM_NAME_LENGTH));
    }

    /**
     * validates and formats form input
     * @param {string} playerName form input to be formatted and validated
     * @param {string} playerID error associator ID 
     * @returns valid user input(playerName)
     */
    validateAndFormatInput(playerName, playerID){
        //format playerName
        const name = playerName.toLowerCase();
        // validate playerName
        if(playerName.length < this.MINIMUM_NAME_LENGTH) throw new Error(`${this.MINIMUM_CHARACTER_ERROR_MESSAGE}, ${playerID} : ${name} is too short`);
        if(playerName.length > this.MAXIMUM_NAME_LENGTH) throw new Error(`${this.MAXIMUM_CHARACTER_ERROR_MESSAGE}, ${playerID} : ${name} is too long`);
        return name;
    }

    //ALGORITHMS
    /**
     * linear search algorithm
     * @param {character} character a character to be searched
     * @param {array} combinedNamesList list to search characters from
     * @returns true or false
     */
    hasElement(character, combinedNamesList){
        for(let index = 0; index < combinedNamesList.length; index++){
            if(combinedNamesList[index].character === character.character) return true;
        }
        return false;
    }

    // New Functions not yet used
    getFormData(form){
        if(arguments.length < 2) throw new Error('No input name is specified');
        console.log(form)
        let valuesList = [];
        const formData = new FormData(form);
        for(let index = 1; index < arguments.length; index++){
            const inputName = arguments[index];
            const output = formData.get(inputName);
            valuesList.push(output);
        }
        console.log(valuesList);
    }
}

new Calculator('calculator-body',
               'calulator-form',
               'first-player-error-message',
               'second-player-error-message',
               'combined-names',
               'calculator-steps-layout');


