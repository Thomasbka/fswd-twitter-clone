import { createConsumer } from "@rails/actioncable";

const CableApp = {};

CableApp.cable = createConsumer();

export default CableApp;
