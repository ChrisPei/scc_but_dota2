export const getCenter = () => {
    return Vector(100, -600, 128);
};

export const testPointIsWater = (point: Vector) => {
    const input = {
        hit: false,
        startpos: (point + Vector(0, 0, 32)) as Vector,
        endpos: Vector(point.x, point.y, 0),
        mask: 32768,
    };
    TraceLine(input);
    return input.hit;
};
