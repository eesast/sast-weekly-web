import { mount } from "enzyme";
import React from "react";
import { MemoryRouter, RouteProps } from "react-router-dom";
import { AuthProvider } from "../AuthContext/AuthContext";
import AuthRoute from "./AuthRoute";

it("goes to login page when not authed", () => {
  const wrapper = mount(
    <MemoryRouter>
      <AuthProvider>
        <MemoryRouter initialEntries={["/protected"]}>
          <AuthRoute path="/protected" component={<div>logged in</div>} />
        </MemoryRouter>
      </AuthProvider>
    </MemoryRouter>
  );

  wrapper
    .childAt(0)
    .instance()
    .setState({ userInfo: null });
  expect(
    wrapper
      .find("Router")
      .at(1)
      .prop<RouteProps>("history").location!.pathname
  ).toBe("/login");
});
