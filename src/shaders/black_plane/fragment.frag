// Fragment Shader

// 'uAlpha' is a uniform variable passed from the application code, representing the alpha value of the overlay
uniform float uAlpha;

void main()
{
    gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
}