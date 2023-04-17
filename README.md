# Chatbot using OpenAI API

This is a simple chatbot application built using the OpenAI API. The chatbot can respond to messages from users and generate a response using GPT-3.5 or GPT-4.

## Installation

To get started, first clone this repository:

```
git clone https://github.com/geriyoco/purrfectGPT.git
```

Then navigate to the project directory:

```
cd purrfectGPT
```

Install the necessary dependencies using NPM:

```
npm install
```

After the installation completes, you can start the Expo development server by running:

```
npm start
```

You can then launch the app in your preferred environment, whether it be an iOS simulator or Android emulator, or on your physical device using the Expo app.

## Configuration

To use the OpenAI API, you need to provide an API key and organization ID. You can obtain these by signing up for OpenAI at https://openai.com/. Once you have your API key and organization ID, replace the contents of [`.env.sample`](.env.sample) with the organization ID and API key.
Lastly, rename `.env.sample` to `.env`.

## Usage

Once you have the app running, you can start chatting with the chatbot. Type your message in the input field and hit "Send" or the Enter key to send your message. The chatbot will respond with its own message.

## Contributing

Contributions to this project are always welcome. To contribute, fork this repository and create a new branch with your changes. Once you're done with your changes, submit a pull request and we'll review it as soon as possible.
