// lang/messages/en/user.js
// All user-visible strings centralized here (no hard-coded strings in logic).

export const MESSAGES = {
  LABEL_HOW_MANY: "How many buttons to create?",
  PLACEHOLDER_RANGE: "3 - 7",
  ERROR_RANGE: "Please enter a whole number between 3 and 7.",
  STATUS_READY: "Enter a number and press Go to start.",
  STATUS_CREATING: (n) => `Creating ${n} button${n>1?'s':''}...`,
  STATUS_MEMORIZE: (n) => `Memorize the order! Scrambling starts in ${n} second${n>1?'s':''}...`,
  STATUS_SCRAMBLING: (i, total) => `Scramble ${i} of ${total}...`,
  STATUS_WAIT: (sec) => `Wait ${sec} second${sec>1?'s':''}...`,
  STATUS_CLICK_NOW: "Now click the buttons in the original order.",
  STATUS_EXCELLENT: "Excellent memory!",
  STATUS_WRONG: "Wrong order! Revealing the correct sequence...",
  BTN_GO: "Go!"
};
