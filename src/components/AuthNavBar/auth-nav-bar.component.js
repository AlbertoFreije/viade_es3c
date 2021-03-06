import React, { useState, useEffect, useCallback } from "react";
import { NavBar } from "@components";
import { useTranslation } from "react-i18next";
import { NavBarContainer } from "./children";
import { ldflexHelper, errorToaster, storageHelper } from "@utils";
import { NavigationItems } from "@constants";
import LanguageDropdown from "../Utils/LanguageDropdown";
import Notification from "../Notifications";

const inboxPath = process.env.REACT_APP_VIADE_ES3C_INBOX_PATH;

type Props = {
	webId: string
};

const AuthNavBar = React.memo((props: Props) => {
	const [ inboxes, setInbox ] = useState([]);
	const { t, i18n } = useTranslation();
	const navigation = NavigationItems.map((item) => ({
		...item,
		label: t(item.label)
	}));

	const { webId } = props;

	/**
   * Looks for all of the inbox containers in the pod and sets inboxes state
   */
	const discoverInbox = useCallback(
		async () => {
			try {
				await storageHelper.createInitialFiles;
				let inboxes = [];
				/**
       * Get user's global inbox path from pod.
       */
				const globalInbox = await ldflexHelper.discoverInbox(webId);

				if (globalInbox) {
					inboxes = [
						...inboxes,
						{
							path: globalInbox,
							inboxName: t("navBar.notifications.global"),
							shape: "default"
						}
					];
				}
				/**
       * Get user's viade inbox path from pod.
       */
				const appStorage = await storageHelper.getAppStorage(webId, inboxPath);
				const appInbox = await ldflexHelper.discoverInbox(`${appStorage}settings.ttl`);

				/**
       * create an inbox object to send over notification component
       */
				if (appInbox) {
					inboxes = [
						...inboxes,
						{
							path: appInbox,
							inboxName: t("navBar.notifications.viade"),
							shape: "default"
						}
					];
				}
				/**
       * If user doesn't has inbox in his pod will show an error and link to
       * know how fix it.
       */
				if (inboxes.length === 0) {
					errorToaster(t("noInboxUser.message"), "Error", {
						label: t("noInboxUser.link.label"),
						href: t("noInboxUser.link.href")
					});
				}
				setInbox(inboxes);
			} catch (error) {
				/**
       * Show general errors
       */
				errorToaster(error.message, t("navBar.notifications.fetchingError"));
			}
		},
		[ webId, inboxes ]
	);

	useEffect(
		() => {
			if (webId) {
				discoverInbox();
			}
		},
		[ webId ]
	);
	const { history } = props;

	return (
		<NavBar
			navigation={navigation}
			sticky
			toolbar={[
				{
					component: () => <LanguageDropdown {...{ t, i18n }} />,
					id: "language",
					componentWillUnmount() {}
				},
				{
					component: () => <Notification {...{ webId, inbox: inboxes }} />,
					id: "notification",
					componentWillUnmount() {}
				},
				{
					component: (props) => <NavBarContainer {...{ t, i18n, webId, history, ...props }} />,
					id: "profile",
					componentWillUnmount() {}
				}
			]}
		/>
	);
});

export default AuthNavBar;
