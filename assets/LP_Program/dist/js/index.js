/**
 * Represents the base configuration of ShowPasswordManager
 */
const baseConfig = {
    buttonSelector: '[data-show-password]',
    inputSelector: '[data-input-password]',
}

/**
 * Handles all the password buttons
 */
class ShowPasswordManager {
    /**
     * Initializes a new instance of ShowPasswordManager with the configuration. If no configuration is given then the default configuration will be used.
     * @param {Object} config configuration of this instance
     */
    constructor (config = baseConfig) {
        this.config = config
        // get all the buttons
        this.buttons = document.querySelectorAll(config.buttonSelector)
        
        // if buttons is not null and buttons.forEach is not then we can iterate throught the collection
        this.buttons && this.buttons.forEach && this.buttons.forEach (b => {
            // get the id of the button
            let buttonID = b.getAttribute(this.trimAttribute(this.config.buttonSelector))
            // get the input matching the button id
            let input = document.querySelector(`[${this.trimAttribute(this.config.inputSelector)}="${buttonID}"]`)

            // if input is not null and if the button has an addEventListener method then we can add a listener on the button
            input && b.addEventListener && b.addEventListener('click', () => {
                // toggle the password attribute
                this.togglePasswordAttribute(input)
            })
        })
    }

    /**
     * Toggle the type attribute of a field from password to text or from text to password
     * @param {HTMLElement} input an input
     */
    togglePasswordAttribute (input) {
        let a = input.getAttribute('type')
        input.setAttribute('type', a === 'password' ? 'text' : 'password')
    }

    /**
     * Slice the '[' and ']' characters from an attribute
     * @param {String} attr an attribute
     */
    trimAttribute (attr) {
        return attr.replace(/[\[\]]+/g, '')
    }
}