---
page_type: sample
languages:
- csharp
products:
- office-teams
description: The Contact Group Lookup app helps interact with members of a contact group
urlFragment: microsoft-teams-app-contactgrouplookup
---
### Note: This is a sample app for Microsoft Teams platform capabilities. The code is not actively managed by Microsoft. The complete source code is available, which allows you to explore it in detail or fork the code and alter it to meet your specific requirements. The source code in this repository may contain links and dependencies to other source code and libraries. Developers are advised to validate all dependencies and update and integrate the latest versions as appropriate. Deployment and support of apps based on this code will be the responsibility of your organization.
# Contact Group Lookup App Template

| [Documentation](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Home) | [Deployment guide](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Deployment-Guide) | [Architecture](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Solution-Overview) |
| ---- | ---- | ---- |

 Contact Group (sometimes referred to as a distribution list) is very useful for organizations to manage communication with a group of individuals. Examples of contact groups include members of an emergency response team at a hospital, employees who work in a particular building, or employees who share a common hobby.
The Contact Group Lookup app makes it easier to interact with members of a contact group directly from Microsoft Teams. Using the app, you can quickly view and chat with members, see their status on Teams, and even start a group chat with multiple members of the Contact Group.

An example workflow in the app is described below:
 - A user starts by opening the Contact Group Lookup app and adds their preferred contact groups to the app.
 - They pin important contact groups to the top of the list by clicking the pin icon
 - The user then clicks the name of the contact group of interest
 -  The user sorts the list by status and starts a group chat with members who are online.

The following images show examples of the user interface of the app:

![Search contact groups](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Images/SearchContactGroups.png)

![Favorited contact groups](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Images/FavoritesScreen.png)

![Initiate Teams chat with group members](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Images/InitiateChat.png)


## Legal notice

This app template is provided under the [MIT License](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/blob/master/LICENSE) terms.  In addition to these terms, by using this app template you agree to the following:

- You, not Microsoft, will license the use of your app to users or organization. 

- This app template is not intended to substitute your own regulatory due diligence or make you or your app compliant with respect to any applicable regulations, including but not limited to privacy, healthcare, employment, or financial regulations.

- You are responsible for complying with all applicable privacy and security regulations including those related to use, collection and handling of any personal data by your app. This includes complying with all internal privacy and security policies of your organization if your app is developed to be sideloaded internally within your organization. Where applicable, you may be responsible for data related incidents or data subject requests for data collected through your app.

- Any trademarks or registered trademarks of Microsoft in the United States and/or other countries and logos included in this repository are the property of Microsoft, and the license for this project does not grant you rights to use any Microsoft names, logos or trademarks outside of this repository. Microsoft’s general trademark guidelines can be found [here](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general.aspx).

- If the app template enables access to any Microsoft Internet-based services (e.g., Office365), use of those services will be subject to the separately-provided terms of use. In such cases, Microsoft may collect telemetry data related to app template usage and operation. Use and handling of telemetry data will be performed in accordance with such terms of use.

- Use of this template does not guarantee acceptance of your app to the Teams app store. To make this app available in the Teams app store, you will have to comply with the [submission and validation process](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/appsource/publish), and all associated requirements such as including your own privacy statement and terms of use for your app.

## Getting started

Begin with the [Solution overview](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Solution-overview) to read about what the app does and how it works.

When you're ready to try out Contact Group Lookup app, or to use it in your own organization, follow the steps in the [Deployment guide](https://github.com/OfficeDev/microsoft-teams-app-contactgrouplookup/wiki/Deployment-Guide).

### Known issue:
The app is currently not supported on iOS devices. We are actively working on fixing the issue and will update the repo as soon as it is available.

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
