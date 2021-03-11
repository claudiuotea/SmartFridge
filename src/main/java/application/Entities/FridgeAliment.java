package application.Entities;

import com.sun.istack.NotNull;

import javax.persistence.*;

/*
Each class will have it's own table
This entity will be used for FridgeController (what actually is in the fridge)
 */

@Entity
@Table(name="FRIDGE")
@IdClass(FridgeAlimentPK.class)
public class FridgeAliment {
    @Column(nullable = false)@Id
    private int alimentId;
    @Column(nullable =false)@Id
    private int userId;

    @Column(nullable = false)
    @NotNull
    private int quantity;


    public FridgeAliment() {
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getAlimentId() {
        return alimentId;
    }

    public void setAlimentId(int alimentId) {
        this.alimentId = alimentId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}

