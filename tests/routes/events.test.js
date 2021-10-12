import { checkoutHandler } from "../../src/routes/events";
import { getEventHandler } from "../../src/routes/events";
import EventModel from "../../src/models/event";
import { jest } from "@jest/globals";
import Stripe from "stripe";

const eventModelFindByIdSpy = jest.spyOn(EventModel, "findById");

describe("eventsRouter", () => {
  test("GETEVENT /", async () => {
    const fakeId = "s4983274dfhjss9d48952";
    const fakeEvent = {
      name: "end of the world",
      eventDate: new Date(),
      lineUp: ["bob", "andy", "misha"],
      location: "London",
      description: "Fire raining from the sky",
      image: "sdkjfhskfjhskjhfsf",
      ticketsAvailable: 200,
      capacity: 2000,
      ticketPriceTiers: [
        {
          pricingTier: 0,
          pricePence: 1500,
        },
      ],
    };
    const req = {
      params: {
        id: fakeId,
      },
    };
    const sendMock = jest.fn();
    const res = { status: jest.fn(() => ({ send: sendMock })) };
    const next = jest.fn();
    eventModelFindByIdSpy.mockResolvedValue(fakeEvent);
    await getEventHandler(req, res, next);

    expect(eventModelFindByIdSpy).toBeCalledWith(fakeId);
    expect(sendMock).toBeCalledWith(fakeEvent);
  });
});

// test("POST /:id/checkout", async () => {
//   const req = {
//     body: {
//       amount: 500,
//       id: "stripetesting",
//       ticketQuantity: 2,
//       name: "bob",
//       surname: "testing",
//       price: 500,
//     },
//     params: { id: "6137d9de5df4376b27a3b92a" },
//     user: { _id: "6137d9de5df4376b27a3b92a" },
//   };
//   const res = {};
//   const next = {};
//   eventModelFindByIdSpy.mockResolvedValueOnce(2);
//   const result = await checkoutHandler(req, res, next);
// });
