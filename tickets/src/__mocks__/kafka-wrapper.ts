export const kafkaWrapper = {
    client: {
      publish: jest
        .fn()
        .mockReturnValue(Promise.resolve('done')),
      producer: jest
        .fn()
        .mockImplementation(
          () => {
            return {
              connect: jest.fn(),
              send: jest.fn()
            };
          }
        ),
    },
  };
  