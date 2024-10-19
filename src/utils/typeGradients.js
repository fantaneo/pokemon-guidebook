const typeGradients = {
  normal:
    "linear-gradient(135deg, rgba(168, 168, 120, 0.3) 0%, rgba(198, 198, 167, 0.3) 100%)",
  fire: "linear-gradient(135deg, rgba(240, 128, 48, 0.3) 0%, rgba(250, 108, 108, 0.3) 100%)",
  water:
    "linear-gradient(135deg, rgba(104, 144, 240, 0.3) 0%, rgba(152, 216, 216, 0.3) 100%)",
  electric:
    "linear-gradient(135deg, rgba(248, 208, 48, 0.3) 0%, rgba(250, 224, 120, 0.3) 100%)",
  grass:
    "linear-gradient(135deg, rgba(120, 200, 80, 0.3) 0%, rgba(167, 219, 141, 0.3) 100%)",
  ice: "linear-gradient(135deg, rgba(152, 216, 216, 0.3) 0%, rgba(188, 230, 230, 0.3) 100%)",
  fighting:
    "linear-gradient(135deg, rgba(192, 48, 40, 0.3) 0%, rgba(214, 120, 115, 0.3) 100%)",
  poison:
    "linear-gradient(135deg, rgba(160, 64, 160, 0.3) 0%, rgba(193, 131, 193, 0.3) 100%)",
  ground:
    "linear-gradient(135deg, rgba(224, 192, 104, 0.3) 0%, rgba(235, 214, 157, 0.3) 100%)",
  flying:
    "linear-gradient(135deg, rgba(168, 144, 240, 0.3) 0%, rgba(198, 183, 245, 0.3) 100%)",
  psychic:
    "linear-gradient(135deg, rgba(248, 88, 136, 0.3) 0%, rgba(250, 146, 178, 0.3) 100%)",
  bug: "linear-gradient(135deg, rgba(168, 184, 32, 0.3) 0%, rgba(198, 209, 110, 0.3) 100%)",
  rock: "linear-gradient(135deg, rgba(184, 160, 56, 0.3) 0%, rgba(209, 193, 125, 0.3) 100%)",
  ghost:
    "linear-gradient(135deg, rgba(112, 88, 152, 0.3) 0%, rgba(162, 146, 188, 0.3) 100%)",
  dragon:
    "linear-gradient(135deg, rgba(112, 56, 248, 0.3) 0%, rgba(178, 158, 252, 0.3) 100%)",
  dark: "linear-gradient(135deg, rgba(112, 88, 72, 0.3) 0%, rgba(162, 146, 136, 0.3) 100%)",
  steel:
    "linear-gradient(135deg, rgba(184, 184, 208, 0.3) 0%, rgba(209, 209, 224, 0.3) 100%)",
  fairy:
    "linear-gradient(135deg, rgba(238, 153, 172, 0.3) 0%, rgba(244, 189, 201, 0.3) 100%)",
};

export function getTypeGradient(type) {
  return typeGradients[type] || typeGradients.normal;
}
