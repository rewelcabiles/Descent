function iso_to_cart(iso_x, iso_y){
	cart_x = (2 * iso_y + iso_x) / 2;
	cart_y = (2 * iso_y - iso_x) / 2;
	return [cart_x, cart_y]
}
function cart_to_iso(cart_x, cart_y){
	iso_x = cart_x - cart_y;
	iso_y = (cart_x + cart_y) / 2;
	return [iso_x, iso_y]
}