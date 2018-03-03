# DialogFlow fulfillment for openHAB

This is a simple repository with DialogFlow fulfillment WebHook integrating with openHAB.

*Work in progress!*

The aim is to have a simple Natural Language Understanding service that would be able to get openHAB Item's state.

The function will look for Item's **label** in order to get specific item's name.

The following Item types should be supported:
Color
Contact
DateTime
Dimmer
Group
Image
Location
Number
Player
Rollershutter
String
Switch

So if you ask "Hey Google tell openHAB to show me the Garage camera" on the device with surface capability, the Action should respond with an actual image.

If you ask "Hey Google, ask openHAB what is the kitchen temperature" it should respond with the value of a given item.
