package application.DTOObjects;


/*
Used to add an aliment in the fridge (id of the aliment and the quantity)
 */
public class AddFridgeAlimentDTO {
    private int userId;
    private String type;
    private int quantity;


    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
