#### getMuiTheme(muiTheme)

This function takes in a muiTheme, it will use this parameter to computes and returns an enhanced muiTheme.

Keep in mind, any changes to the theme object must appear as another call
to this function.

![Alt text](scene/image/block1.png "Optional title")

**Never** directly mutate the theme as the effects will not be reflected in any component
until another render is triggered for that component leaving your application
in a moody state.

![Alt text](scene/image/block2.png "Optional title")